import { usePersonaStore } from '../shared/stores/personaStore';
import { PERSONAS } from '../src/personaTypes';

test('sets and retrieves the active persona', () => {
  const { setPersona } = usePersonaStore.getState();
  setPersona(PERSONAS.GRUNK);

  const { activePersona } = usePersonaStore.getState();
  expect(activePersona).toEqual(PERSONAS.GRUNK);
});