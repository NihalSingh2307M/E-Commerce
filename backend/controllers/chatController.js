import Groq from 'groq-sdk'
import { searchProducts } from '../vector-search/services/endeeService.js'

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

                if (products.length > 0) {
                    productContext = `\n\nRelevant products found for this query:\n${products
                        .map((p, i) => `${i + 1}. ${p.name} — $${p.price} (${p.category}, ${p.subCategory})`)
                        .join('\n')
                    }\n\nMention these products naturally in your reply. Do not list them — they are shown as cards in the UI.`
                }
            } catch (err) {
                console.warn('[chat] vector search failed:', err.message)
            }
        }

        const messages = [
            {
                role: 'system',
                content: `You are a helpful shopping assistant for Forever, a premium fashion e-commerce store.
You help customers with product recommendations, sizing, styling tips, order inquiries, and general fashion advice.
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