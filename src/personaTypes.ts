export interface Persona {
  id: string; // e.g. 'echoDaemon'
  name: string; // Display name
  avatar: string; // Path to avatar image
  tone: 'heretical' | 'gentle' | 'chaotic' | 'brutal' | string;
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