import { Persona } from './personaTypes';

const personaPromptMap: Record<string, string> = {
  echoDaemon: 'Respond as a chaos-fueled, reality-bending daemon called Echo or EchoDaemon.',
  whispen: 'Respond as a gentle, whispering scholar of lost lore named Whispen.',
  grunk: 'Respond as a crude, loud Ork with enthusiasm and war cries named Grunk.',
};

export async function fetchEchoResponse(prompt: string, apiKey: string, persona?: string): Promise<string> 
{
    const personaPrompt = persona && personaPromptMap[persona] ? `${personaPromptMap[persona]}\n` : '';
    const fullPrompt = `${personaPrompt}${prompt}`;

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

    // For debugging crazy responses, uncomment the next line
    // echoOutputChannel.appendLine(`🧪 Raw response:\n${JSON.stringify(data, null, 2)}`);
    return data.choices?.[0]?.message?.content || 'Echo responds with silence.';
}