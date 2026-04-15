import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const chatWithGemini = async (req, res) => {
    try {
        const { message, history = [] } = req.body

        if (!message || typeof message !== 'string' || message.trim() === '') {
            return res.status(400).json({ success: false, message: 'Message is required' })
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ success: false, message: 'Gemini API key not configured' })
        }

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            systemInstruction: `You are a helpful shopping assistant for Forever, a premium fashion e-commerce store. 
You help customers with product recommendations, sizing, styling tips, order inquiries, and general fashion advice.
Keep responses concise, friendly, and on-topic. If asked about unrelated topics, gently redirect to fashion or shopping.`,
        })

        // Build chat history in Gemini format
        const formattedHistory = history
            .filter((msg) => msg.role && msg.text)
            .map((msg) => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }],
            }))

        const chat = model.startChat({ history: formattedHistory })

        const result = await chat.sendMessage(message.trim())
        const response = await result.response
        const text = response.text()

        return res.json({ success: true, reply: text })
    } catch (error) {
        console.error('Gemini chat error:', error.message)
        return res.status(500).json({ success: false, message: 'Failed to get response. Please try again.' })
    }
}

export { chatWithGemini }