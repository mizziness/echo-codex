import { usePersonaStore } from '@shared/stores/personaStore';
import { useState } from 'react';

type Message = { role: string; content: string };

export default function SidebarPanel() {
  const persona = usePersonaStore((state) => state.activePersona);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Simulate EchoDaemon response
      const reply = {
        role: 'echo',
        content: `(${(persona.name)}): thinking...`,
      };
      // Replace this with your actual API call later
      setTimeout(() => {
        setMessages((prev) => [...prev, reply]);
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      console.error(`${persona.name} error:`, err);
      setIsLoading(false);
    }

    setInput('');
  };

  return (
    <div className="flex flex-col h-full w-full bg-zinc-900 text-white p-4 space-y-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{persona.name}</h2>
          <p className="text-sm text-zinc-400">{persona.description}</p>
        </div>
        <img
          src={persona.avatar}
          alt={persona.name}
          className="w-10 h-10 rounded-full"
        />
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-md ${
              msg.role === 'user'
                ? 'bg-zinc-800 text-right ml-auto'
                : 'bg-zinc-700'
            }`}
          >
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div className="text-zinc-500 italic animate-pulse">
            ${(persona.uiFlavor.loadingMessage || 'Thinking...')}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex space-x-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 resize-none bg-zinc-800 p-2 rounded-md focus:outline-none"
          rows={2}
          placeholder={`${(persona.uiFlavor.commandPrompt || 'Type your message here: ')}`}
        />
        <button
          onClick={sendMessage}
          className="bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded-md"
        >
          `${(persona.uiFlavor.submitButton || 'Send')}`
        </button>
      </div>
    </div>
  );
}
