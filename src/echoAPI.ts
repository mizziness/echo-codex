import { PERSONAS } from './personaTypes';

export async function fetchEchoResponse(prompt: string, apiKey: string, persona?: string): Promise<string> 
{
    const activePersona = PERSONAS[persona?.toUpperCase() as keyof typeof PERSONAS] || PERSONAS.ECHODAEMON;
    const personaPrompt = activePersona.promptPrefix ? `${activePersona.promptPrefix}\n` : PERSONAS.ECHODAEMON.promptPrefix;
    const fullPrompt = `${personaPrompt}: ${prompt}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [{ role: 'user', content: fullPrompt }],
        }),
    });

    const data = await response.json() as {
        choices?: { message?: { content?: string } }[];
    };

    return data.choices?.[0]?.message?.content || activePersona?.uiFlavor?.noResponse || 'No response available.';
}