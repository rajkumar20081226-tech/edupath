"use client";

import { FormEvent, useState } from 'react';

type Message = {
  id: number;
  role: 'user' | 'bot';
  text: string;
};

const initialMessages: Message[] = [
  {
    id: 1,
    role: 'bot',
    text: 'Hi! I am EduPath, your AI study assistant. Ask me about homework, revision, science, math, or coding.',
  },
];

const quickPrompts = [
  'Create a quiz for me',
  'Explain photosynthesis',
  'Help with algebra',
  'Plan my study session',
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendMessage(promptText?: string) {
    const text = (promptText ?? input).trim();
    if (!text || loading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      const botMessage: Message = {
        id: Date.now() + 1,
        role: 'bot',
        text: data.reply || 'I am here to help.',
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: 'bot',
          text: 'Something went wrong. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage();
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="logo-dot" />
          <span>EduPath</span>
        </div>
        <span className="status-badge">AI Student Tutor</span>
      </header>

      <section className="hero">
        <div className="hero-card">
          <h1>Study smarter with your AI tutor.</h1>
          <p>
            EduPath helps students understand concepts faster, prepare for exams, practice
            homework, and stay consistent with study plans.
          </p>

          <div className="cta-row">
            <button className="primary-btn" onClick={() => sendMessage('Help me study smarter today')}>
              Talk to AI
            </button>
            <button className="secondary-btn" onClick={() => sendMessage('Create a quiz for me')}>
              Create Quiz
            </button>
          </div>
        </div>

        <div className="visual-card">
          <div className="chatbox">
            <div className="chat-header">
              <h2>Student AI Chat</h2>
            </div>

            <div className="chat-window">
              {messages.map((message) => (
                <div key={message.id} className={`message ${message.role}`}>
                  {message.text}
                </div>
              ))}
              {loading && <div className="message bot">Thinking...</div>}
            </div>

            <div className="quick-prompts">
              {quickPrompts.map((prompt) => (
                <button key={prompt} className="quick-btn" onClick={() => sendMessage(prompt)}>
                  {prompt}
                </button>
              ))}
            </div>

            <form className="chat-form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Ask me anything about your studies..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit" disabled={loading}>
                {loading ? '...' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="feature-grid">
        <div className="feature-card">
          <h3>Homework help</h3>
          <p>Get clear explanations for assignments, math, science, and coding questions.</p>
        </div>

        <div className="feature-card">
          <h3>Exam prep</h3>
          <p>Build revision plans and practice questions for better performance.</p>
        </div>

        <div className="feature-card">
          <h3>Learning support</h3>
          <p>Turn concepts into simple explanations and daily study routines.</p>
        </div>
      </section>
    </main>
  );
}
