async function acodeCompatibilitySmoke() {
	const commands = acode.require("commands");
	const editorLanguages = acode.require("editorLanguages");
	const editorThemes = acode.require("editorThemes");
	const lsp = acode.require("lsp");
	const terminal = acode.require("terminal");

	acode.setPluginInit("com.example.plugin", (_baseUrl, $page, _cache) => {
		commands.addCommand({
			name: "example-plugin",
			description: "Open the example page",
			bindKey: { win: "Ctrl-Alt-E", mac: "Command-Alt-E" },
			exec: (view) => {
				$page.innerHTML =
					"<h1>Example Plugin</h1><p>This is an example plugin.</p>";
				$page.show();
				return (view?.state.doc.length ?? 0) >= 0;
			},
		});
	});

	acode.setPluginUnmount("com.example.plugin", () => {
		commands.removeCommand("example-plugin");
	});

	const view = editorManager.editor;
	const text = view.state.doc.toString();

	view.dispatch({
		changes: {
			from: 0,
			to: view.state.doc.length,
			insert: text,
		},
	});

	editorLanguages.register("myMode", ["mym"], "My Mode", async () => []);
	editorLanguages.unregister("myMode");

	editorThemes.register({
		id: "example-night",
		caption: "Example Night",
		dark: true,
		getExtension: () =>
			editorThemes.createTheme({
				dark: true,
				styles: {
					"&": {
						backgroundColor: "#0f1115",
						color: "#d6deeb",
					},
				},
			}),
	});

	acode.newEditorFile("example.ts", {
		text,
		editable: true,
	});

	acode.registerFormatter(
		"com.example.plugin",
		["ts"],
		async () => {
			const currentText = view.state.doc.toString();

			view.dispatch({
				changes: {
					from: 0,
					to: view.state.doc.length,
					insert: currentText,
				},
			});
		},
		"Example Formatter",
	);

	acode.registerFileHandler("com.example.svg-viewer", {
		extensions: ["svg", "*"],
		handleFile: async (fileInfo) => {
			console.log(fileInfo.name, fileInfo.uri, fileInfo.extension);
		},
	});

	commands.registry.execute("example-plugin", view, { source: "test" });
	terminal.themes.getNames();
	terminal.moreOptions.add({
		label: "Copy",
		action: () => {},
	});
	terminal.touchSelection.moreOptions.list();

	const lspServer = lsp.defineServer({
		id: "example-typescript",
		label: "Example TypeScript",
		languages: ["typescript"],
		command: "typescript-language-server",
		args: ["--stdio"],
		installer: lsp.installers.npm({
			executable: "typescript-language-server",
			packages: ["typescript", "typescript-language-server"],
		}),
	});

	lsp.upsert(lspServer);
	lsp.upsert({
		id: "example-termux-typescript",
		label: "Example TypeScript (Termux)",
		languages: ["typescript"],
		runtimes: ["termux"],
		transport: {
			kind: "stdio",
			command: "typescript-language-server",
			args: ["--stdio"],
		},
	});

	lsp.registerRuntimeProvider({
		id: "termux",
		label: "Termux",
		canHandle(server, context) {
			return (
				server.runtimes?.includes("termux") === true &&
				context.workspaceKind === "termux-saf"
			);
		},
		resolveUris(_server, context) {
			return {
				documentUri: context.normalizedDocumentUri,
				rootUri: context.normalizedRootUri,
				scope: "workspace",
			};
		},
		async checkInstallation() {
			return {
				status: "unknown",
				version: null,
				canInstall: false,
				canUpdate: false,
			};
		},
		async start() {
			return {
				kind: "websocket",
				providerId: "termux",
				url: "ws://127.0.0.1:45130/",
			};
		},
	});

	lsp.installers.githubRelease({
		repo: "owner/repo",
		binaryPath: "server",
		assetNames: { arm64: "server-arm64.zip" },
	});
	lsp.clientManager.setOptions({ allowNonTerminalWorkspace: true });
	lsp.clientManager.getActiveClients();

	const formatters = acode.formatters;
	const formatterOptions = acode.getFormatterFor(["ts"]);
	const loaded = await acode.waitForPlugin("com.example.other-plugin");

	acode.clearBrokenPluginMark("com.example.plugin");

	return {
		formatterOptions,
		formatters,
		loaded,
	};
}

void acodeCompatibilitySmoke;
