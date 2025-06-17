// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { fetchEchoResponse } from './echoAPI';

// Create a dedicated output channel for EchoCodex
// This will be used to log messages and responses from the Echo AI

const echoOutputChannel = vscode.window.createOutputChannel('EchoCodex');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "echo-codex" is now active!');

	const secrets = context.secrets;
	const existingKey = await secrets.get('openaiApiKey');

	if (!existingKey) {
		const input = await vscode.window.showInputBox({
			prompt: 'Enter your OpenAI API key',
			ignoreFocusOut: true,
			password: true
		});

		if (input) {
			await secrets.store('openaiApiKey', input);
			vscode.window.showInformationMessage('OpenAI API key saved securely.');
		} else {
			vscode.window.showWarningMessage('OpenAI API key not provided. Echo will remain silent.');
		}
	}

	vscode.commands.registerCommand('echo-codex.setApiKey', async () => {
		const newKey = await vscode.window.showInputBox({
			prompt: 'Enter your OpenAI API key:',
			password: true,
			ignoreFocusOut: true
		});
		if (newKey) {
			await context.secrets.store('openaiApiKey', newKey);
			vscode.window.showInformationMessage('API key updated.');
		}
	});

	// Ask Echo a question via this command 
	const disposable = vscode.commands.registerCommand('echo-codex.askEcho', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		//vscode.window.showInformationMessage('Hello World from EchoCodex!');
		const input = await vscode.window.showInputBox({
			prompt: 'What do you wish to ask Echo?',
			placeHolder: 'Ask about code, errors, or existential dread...',
		});

		if (!input) {
			return;
		}

		const response = await getEchoResponse(input, secrets);

		// vscode.window.showInformationMessage(response); // Display the response in a message box
		// Instead, we will log it to the output channel

		if (!response) {
			vscode.window.showErrorMessage('Echo did not respond. Please check your API key and internet connection and try again.');
			return;
		}

		echoOutputChannel.clear(); // optional: clears previous message
		// echoOutputChannel.appendLine('📜👁️‍🗨️ ~~~ Message from EchoCodex ~~~');
		echoOutputChannel.appendLine(`🔮 Echo says:\n\n${response}`);
		echoOutputChannel.show(true); // true = preserve focus in editor

	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }

export async function getEchoResponse(prompt: string, secrets: vscode.SecretStorage): Promise<string> {
	// const apiKey = process.env.OPENAI_API_KEY; // Use for environment variable

	const apiKey = await secrets.get('openaiApiKey');
	// await vscode.workspace.getConfiguration().get('echoCodex.apiKey') ||
	// await vscode.authentication.getSession('github', ['user:email'], { createIfNone: false })?.accessToken || // ignore if you're not using auth
	// await vscode.extensions.getExtension('yourpublisher.echo-codex')?.exports?.getSecret?.('openaiApiKey'); // TODO Update this when we are ready to publish

	if (!apiKey) {
		return 'Missing OpenAI API key. Please set it in the extension settings or via the command palette.';
	}

	try {
		
		return await fetchEchoResponse(prompt, apiKey);

	} catch (error) {

		echoOutputChannel.appendLine(`⚠️ Error summoning Echo: ${error}`);
		return 'Echo failed to answer due to an error.';

	}
}
