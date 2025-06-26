export const PERSONAS = {
  ECHO_DAEMON: 'echoDaemon',
  GRUNK: 'grunk',
  WHISPEN: 'whispen',
} as const;

export interface Persona {
  id: string; // e.g. 'echoDaemon'
  name: string; // Display name
  avatar: string; // Path to avatar image
  tone: typeof PERSONAS[keyof typeof PERSONAS] | string;
  promptPrefix: string; // Injected into system prompt
  innerThoughts: string[]; // For rotating ticker text
  uiFlavor: {
    apiKeySaved: string;
    apiKeyMissing: string;
    submitButton: string;
    loadingMessage: string;
    errorCatchphrase: string;
    greeting: string;
    commandPrompt: string;
    commandPlaceholder: string;
    noResponse: string;
  };
}