"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const echoAPI_1 = require("../src/echoAPI");
global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve({
        choices: [
            { message: { content: 'Mocked Echo response' } }
        ]
    })
}));
describe('fetchEchoResponse', () => {
    it('returns the expected message', async () => {
        const result = await (0, echoAPI_1.fetchEchoResponse)('Hello?', 'fake-key');
        expect(result).toBe('Mocked Echo response');
    });
});
//# sourceMappingURL=fetchEchoResponse.test.js.map