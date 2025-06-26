/**
 * * EchoCodex Extension for Visual Studio Code
 * * This extension allows users to interact with EchoCodex, an AI assistant for coding-related
 * * queries, directly from the VS Code environment.
 * @file extension.ts
 * @module echo-codex
 * @author Tshipps
 * @license MIT
 * @see {@link https://github.com/mizziness/echo-codex}	
 */

import * as vscode from 'vscode';
import { fetchEchoResponse } from './echoAPI';

/**
 * EchoSidebarProvider class implements the vscode.WebviewViewProvider interface
 * to create a sidebar view for the EchoCodex extension.
 */
class EchoSidebarProvider implements vscode.WebviewViewProvider {
	constructor(private readonly context: vscode.ExtensionContext) { }

	resolveWebviewView(
		webviewView: vscode.WebviewView,
		_context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken
	) {
		webviewView.webview.options = {
			enableScripts: true
		};

		webviewView.webview.html = getWebviewContent();

		webviewView.webview.onDidReceiveMessage(async message => {
			if (message.command === 'submit') {
				await handlePrompt(message.text, this.context.secrets, "panel");
			}
		});
	}
}

/* Create a dedicated output channel for EchoCodex */
const echoOutputChannel = vscode.window.createOutputChannel('EchoCodex');

/* Activation function for the EchoCodex extension */
/* ******************************************************************************* */
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

	const sidebarProvider = new EchoSidebarProvider(context);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider('echoCodexView', sidebarProvider)
	);

	/**
	 * Registers the 'echo-codex.askEcho' command, which prompts the user for input via the command palette,
	 * displays a webview panel, sends the user's prompt to EchoCodex, and outputs the response to the output channel.
	 * If the response is empty or an error occurs, an error message is shown to the user.
	 *
	 * @remarks
	 * - The command opens a webview panel titled 'Ask EchoCodex'.
	 * - User input is collected using an input box.
	 * - The response from EchoCodex is displayed in a dedicated output channel.
	 * - Handles error cases where no response is received.
	 *
	 * @see {@link vscode.commands.registerCommand}
	 */
	const disposable = vscode.commands.registerCommand('echo-codex.askEcho', async () => {
		/**
		 * Creates a webview panel for asking EchoCodex questions.
		 * The panel is displayed beside the current editor column and allows for script execution.
		 * @see {@link vscode.window.createWebviewPanel}
		 */
		const panel = vscode.window.createWebviewPanel(
			'echoCodexPrompt',
			'Ask EchoCodex',
			vscode.ViewColumn.Beside,
			{
				enableScripts: true
			}
		);
		panel.webview.html = getWebviewContent();

		/**
		 * Listens for messages from the webview.
		 * When the user submits a question, it retrieves the input text,
		 * sends it to the EchoCodex API, and displays the response in the output channel
		 * @see {@link vscode.Webview.onDidReceiveMessage}
		 */
		panel.webview.onDidReceiveMessage(async message => {
			if (message.command === 'submit') {
				const secrets = context.secrets;
				await handlePrompt(message.text, secrets, "panel");
			}
		});

		/**
		 * Prompts the user for input via an input box.
		 * The input box allows the user to ask questions about code, errors, or other topics
		 * related to their development work.
		 * @see {@link vscode.window.showInputBox}
		 */
		const input = await vscode.window.showInputBox({
			prompt: 'What do you wish to ask Echo?',
			placeHolder: 'Ask about code, errors, or existential dread...',
		});

		if (!input) {
			return;
		}

		await handlePrompt(input, context.secrets, "command");

		const response = await getEchoResponse(input, context.secrets);

		// vscode.window.showInformationMessage(response); // Display the response in a message box
		// Instead, we will log it to the output channel

		if (!response) {
			vscode.window.showErrorMessage('Echo did not respond. Please check your API key and internet connection and try again.');
			return;
		}

		echoOutputChannel.clear();
		echoOutputChannel.appendLine(`🔮 Echo says:\n\n${response}`);
		echoOutputChannel.show(true);

	});

	context.subscriptions.push(disposable);
}

/* Deactivation function for the EchoCodex extension */
/* ******************************************************************************* */
export function deactivate() { }

/* Get Echo response from the API */
/* ******************************************************************************* */
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
		// Get the currently-set Persona, defaulting to 'heretic'
		const persona = vscode.workspace.getConfiguration('echoCodex').get<string>('persona') || 'echoDaemon';
		return await fetchEchoResponse(prompt, apiKey, persona);

	} catch (error) {

		echoOutputChannel.appendLine(`⚠️ Error summoning Echo: ${error}`);
		return 'Echo failed to answer due to an error.';

	}
}

/* Handle both command and panel prompts */
/* ******************************************************************************* */
async function handlePrompt(prompt: string, secrets: vscode.SecretStorage, source: 'command' | 'panel') {
	// Use source to determine where the prompt came from, if needed
	// echoOutputChannel.appendLine(`🗳️ Source: ${source}`); // Uncomment this line for debugging the source of the prompt
	const response = await getEchoResponse(prompt, secrets);
	echoOutputChannel.clear();
	echoOutputChannel.appendLine(`🔮 Echo says:\n\n${response}`);
	echoOutputChannel.show(true);
}

/* Get the HTML content for the webview panel */
/* ******************************************************************************* */
function getWebviewContent(): string {
	return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<style>
				body {
					font-family: sans-serif;
					margin: 0;
					padding: 1rem;
				}
				textarea {
					width: 100%;
					height: 200px;
					resize: vertical;
					font-family: monospace;
				}
				button {
					margin-top: 1rem;
				}
			</style>
		</head>
		<body>
			<h2>Ask EchoCodex</h2>
			<textarea id="prompt" placeholder="Enter your question or code..."></textarea>
			<br/>
			<button onclick="submit()">Submit</button>

			<script>
				const vscode = acquireVsCodeApi();
				function submit() {
					const text = document.getElementById('prompt').value;
					vscode.postMessage({ command: 'submit', text });
				}
			</script>
		</body>
		</html>
	`;
}

