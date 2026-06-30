import Groq from 'groq-sdk'
import { searchProducts } from '../vector-search/services/qdrantService.js'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const PRODUCT_INTENT_REGEX = /\b(suggest|recommend|show|find|looking for|want|need|buy|wear|outfit|dress|shirt|jacket|pant|trouser|kurta|saree|top|skirt|shoe|sneaker|boots|bag|winter|summer|casual|formal|party|ethnic|western|cheap|affordable|under\s*\d+)\b/i

const isProductQuery = (message) => PRODUCT_INTENT_REGEX.test(message)

const chatWithAI = async (req, res) => {
    try {
        const { message, history = [] } = req.body

        if (!message || typeof message !== 'string' || message.trim() === '') {
            return res.status(400).json({ success: false, message: 'Message is required' })
        }

        const trimmed = message.trim()

        let products = []
        let productContext = ''

        if (isProductQuery(trimmed)) {
            try {
                const results = await searchProducts(trimmed, { topK: 4 })
                products = results.filter(r => r.similarity > 0.3)

                // Observability: log raw scores so a future empty-results report
                // can be diagnosed as "Qdrant returned nothing" vs "results came
                // back but all scored below the 0.3 threshold" vs "search threw".
                console.log(
                    `[chat] query="${trimmed}" rawResults=${results.length} ` +
                    `aboveThreshold=${products.length} scores=[${results.map(r => r.similarity?.toFixed(3)).join(', ')}]`
                )

                if (products.length > 0) {
                    productContext = `\n\nRelevant products found for this query:\n${products
                        .map((p, i) => `${i + 1}. ${p.name} — $${p.price} (${p.category}, ${p.subCategory})`)
                        .join('\n')
                    }\n\nMention ONLY these products by name in your reply — do not invent, rename, or add details (style, fabric, fit) for any product not in this list. Do not list them — they are shown as cards in the UI.`
                } else {
                    productContext = `\n\nNo specific products matched this query in our catalog. Do NOT invent or describe specific product names, prices, or details — we have no real items to recommend right now. Instead, acknowledge what the customer is looking for, and either ask a clarifying question (e.g. budget, style, color) or suggest they browse the relevant category page. Never state a price or product name that wasn't explicitly given to you.`
                }
            } catch (err) {
                console.warn('[chat] vector search failed:', err.message)
                productContext = `\n\nProduct search is temporarily unavailable. Do NOT invent or describe specific product names, prices, or details. Acknowledge the request and suggest the customer browse the site directly.`
            }
        }

        const messages = [
            {
                role: 'system',
                content: `You are a helpful shopping assistant for Forever, a premium fashion e-commerce store.
You help customers with product recommendations, sizing, styling tips, order inquiries, and general fashion advice.
IMPORTANT: Always display prices in USD with the $ symbol (e.g. $40). Never use ₹, Rs, INR, or any other currency.
CRITICAL: Only ever mention a specific product name, price, or product detail if it was explicitly provided to you below under "Relevant products found." NEVER invent, guess, or improvise a product name, price, fabric, or feature — doing so misleads real customers about real items for sale. If no products were provided, speak generally about style/category without naming specific items.
Keep responses concise, friendly, and on-topic. If asked about unrelated topics, gently redirect to fashion or shopping.
When recommending products, be warm and specific. Never bullet-list the products — they are shown as cards in the UI.${productContext}`,
            },
            ...history
                .filter((msg) => msg.role && msg.text)
                .map((msg) => ({
                    role: msg.role === 'user' ? 'user' : 'assistant',
                    content: msg.text,
                })),
            { role: 'user', content: trimmed },
        ]

        const completion = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages,
            max_tokens: 1024,
        })

        const text = completion.choices[0].message.content
        return res.json({ success: true, reply: text, products })

    } catch (error) {
        console.error('Groq chat error:', error.message)
        return res.status(500).json({ success: false, message: 'Failed to get response. Please try again.' })
    }
}

export { chatWithAI }