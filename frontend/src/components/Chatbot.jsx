import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import axios from 'axios'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hello! I\'m your Forever style assistant. How can I help you today?' }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const panelRef = useRef(null)
    const fabRef = useRef(null)
    const messagesRef = useRef(null)
    const inputRef = useRef(null)

    // Initial mount — hide panel, show FAB
    useLayoutEffect(() => {
        gsap.set(panelRef.current, { opacity: 0, y: 24, scale: 0.96, pointerEvents: 'none' })
        gsap.fromTo(
            fabRef.current,
            { opacity: 0, scale: 0.7 },
            { opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.7)', delay: 0.5 }
        )
    }, [])

    // Open / close animation
    useEffect(() => {
        if (isOpen) {
            gsap.to(panelRef.current, {
                opacity: 1, y: 0, scale: 1,
                duration: 0.38, ease: 'power3.out',
                pointerEvents: 'auto',
            })
            // Focus input after animation
            setTimeout(() => inputRef.current?.focus(), 380)
        } else {
            gsap.to(panelRef.current, {
                opacity: 0, y: 24, scale: 0.96,
                duration: 0.28, ease: 'power2.in',
                pointerEvents: 'none',
            })
        }
    }, [isOpen])

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight
        }
    }, [messages, isLoading])

    // Animate new message bubble in
    const animateLastMessage = () => {
        const bubbles = messagesRef.current?.querySelectorAll('.chat-bubble')
        if (!bubbles?.length) return
        const last = bubbles[bubbles.length - 1]
        gsap.fromTo(last, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out' })
    }

    useEffect(() => {
        if (messages.length > 1) animateLastMessage()
    }, [messages])

    const handleToggle = () => setIsOpen((prev) => !prev)

    const handleSend = async () => {
        const trimmed = input.trim()
        if (!trimmed || isLoading) return

        const userMsg = { role: 'user', text: trimmed }
        setMessages((prev) => [...prev, userMsg])
        setInput('')
        setIsLoading(true)

        // Build history for context (exclude the greeting, exclude last user msg)
        const history = messages
            .filter((m) => m.role !== 'bot' || messages.indexOf(m) !== 0)
            .map((m) => ({ role: m.role === 'user' ? 'user' : 'model', text: m.text }))

        try {
            const { data } = await axios.post(`${BACKEND_URL}/api/chat`, {
                message: trimmed,
                history,
            })

            const botMsg = {
                role: 'bot',
                text: data.success ? data.reply : 'Sorry, I couldn\'t get a response. Please try again.',
            }
            setMessages((prev) => [...prev, botMsg])
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: 'bot', text: 'Something went wrong. Please try again in a moment.' },
            ])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <>
            {/* Chat Panel */}
            <div
                ref={panelRef}
                className="fixed bottom-24 right-4 sm:right-6 z-9998 w-[calc(100vw-2rem)] max-w-sm origin-bottom-right"
                style={{ willChange: 'transform, opacity' }}
            >
                <div className="flex flex-col rounded-none shadow-2xl overflow-hidden border border-[#E8E0D5]"
                    style={{ background: '#F9F6F0', height: '26rem' }}>

                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8E0D5]"
                        style={{ background: '#1C1C1C' }}>
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 flex items-center justify-center shrink-0"
                                style={{ background: '#B8956A' }}>
                                <span className="cormorant text-[#1C1C1C] text-sm font-light italic">F</span>
                            </div>
                            <div>
                                <p className="cormorant text-[#F9F6F0] text-base font-light tracking-[0.08em] leading-none">
                                    Style Assistant
                                </p>
                                <p className="jost text-[9px] tracking-[0.25em] uppercase text-[rgba(255,255,255,0.4)] mt-0.5">
                                    Forever
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleToggle}
                            className="w-7 h-7 flex items-center justify-center text-[rgba(255,255,255,0.5)] hover:text-gold transition-colors duration-200"
                            aria-label="Close chat"
                        >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div
                        ref={messagesRef}
                        className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
                        style={{ scrollbarWidth: 'thin', scrollbarColor: '#D4C4B0 transparent' }}
                    >
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`chat-bubble flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'jost text-[#F9F6F0] text-[13px]'
                                        : 'jost text-[#1C1C1C] text-[13px] border border-[#E8E0D5]'
                                        }`}
                                    style={msg.role === 'user' ? { background: '#1C1C1C' } : { background: '#FFFFFF' }}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isLoading && (
                            <div className="chat-bubble flex justify-start">
                                <div className="px-3.5 py-2.5 border border-[#E8E0D5]" style={{ background: '#FFFFFF' }}>
                                    <div className="flex items-center gap-1 h-4">
                                        {[0, 0.18, 0.36].map((delay, i) => (
                                            <span
                                                key={i}
                                                className="block w-1.5 h-1.5 rounded-full"
                                                style={{
                                                    background: '#B8956A',
                                                    animation: `chatbotPulse 1.1s ease-in-out ${delay}s infinite`,
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="border-t border-[#E8E0D5] px-3 py-3 flex items-center gap-2"
                        style={{ background: '#FFFFFF' }}>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about styles, sizing…"
                            disabled={isLoading}
                            className="flex-1 jost text-[13px] text-[#1C1C1C] placeholder-[#A89880] bg-transparent outline-none border-none tracking-wide disabled:opacity-50"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="w-8 h-8 flex items-center justify-center shrink-0 transition-opacity duration-200 disabled:opacity-30"
                            style={{ background: '#1C1C1C' }}
                            aria-label="Send message"
                        >
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                <path d="M1 12L12 1M12 1H4M12 1V9" stroke="#B8956A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* FAB Button */}
            <button
                ref={fabRef}
                onClick={handleToggle}
                className="fixed bottom-6 right-4 sm:right-6 z-9999 w-12 h-12 flex items-center justify-center shadow-xl transition-transform duration-200 hover:scale-105 active:scale-95"
                style={{ background: '#1C1C1C' }}
                aria-label="Toggle chat assistant"
            >
                {isOpen ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 2l12 12M14 2L2 14" stroke="#B8956A" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                            stroke="#B8956A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </button>

            {/* Typing dot animation keyframes — injected once, no CSS file */}
            <style>{`
        @keyframes chatbotPulse {
        0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
        40% { transform: scale(1); opacity: 1; }
        }
    `}</style>
        </>
    )
}

export default Chatbot