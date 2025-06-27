import { echoDaemon } from './personas/EchoDaemon';
import { grunk } from './personas/Grunk';
import { whispen } from './personas/Whispen';

export const PERSONAS = {
  ECHODAEMON: echoDaemon,
  WHISPEN: whispen,
  GRUNK: grunk,
} as const;

export type PersonaId = keyof typeof PERSONAS;
export type PersonaType = typeof PERSONAS[PersonaId];

export interface Persona {
  id: string; // e.g. 'echoDaemon'
  name: string; // Display name
  description: string; // Short description of the persona
  avatar: string; // Path to avatar image
  tone: typeof PERSONAS[keyof typeof PERSONAS] | string;
  promptPrefix: string; // Injected into system prompt
  innerThoughts: object; // For rotating ticker text
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