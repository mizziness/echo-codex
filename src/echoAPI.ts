export async function fetchEchoResponse(prompt: string, apiKey: string): Promise<string> {
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
        }),
    });

    const data = await response.json() as {
        choices?: { message?: { content?: string } }[];
    };

    // For debugging crazy responses, uncomment the next line
    // echoOutputChannel.appendLine(`🧪 Raw response:\n${JSON.stringify(data, null, 2)}`);
    return data.choices?.[0]?.message?.content ?? 'Echo responds with silence.';

}