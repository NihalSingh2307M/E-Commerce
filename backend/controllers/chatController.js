import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const chatWithAI = async (req, res) => {
    try {
        const { message, history = [] } = req.body

        if (!message || typeof message !== 'string' || message.trim() === '') {
            return res.status(400).json({ success: false, message: 'Message is required' })
        }

        const messages = [
            {
                role: 'system',
                content: `You are a helpful shopping assistant for Forever, a premium fashion e-commerce store. 
You help customers with product recommendations, sizing, styling tips, order inquiries, and general fashion advice.
Keep responses concise, friendly, and on-topic. If asked about unrelated topics, gently redirect to fashion or shopping.`,
            },
            ...history
                .filter((msg) => msg.role && msg.text)
                .map((msg) => ({
                    role: msg.role === 'user' ? 'user' : 'assistant',
                    content: msg.text,
                })),
            { role: 'user', content: message.trim() },
        ]

        const completion = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant', // fast & free
            messages,
            max_tokens: 1024,
        })

        const text = completion.choices[0].message.content
        return res.json({ success: true, reply: text })

    } catch (error) {
        console.error('Groq chat error:', error.message)
        return res.status(500).json({ success: false, message: 'Failed to get response. Please try again.' })
    }
}

export { chatWithAI }