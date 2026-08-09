async function acodeCompatibilitySmoke() {
	const commands = acode.require("commands");
	const editorLanguages = acode.require("editorLanguages");
	const editorThemes = acode.require("editorThemes");
	const fileIndex = acode.require("fileIndex");
	const fileList = acode.require("fileList");
	const lsp = acode.require("lsp");
	const terminal = acode.require("terminal");
	const webview = acode.require("webview");
	const config = acode.require("config");
	const helpers = acode.require("helpers");
	const cm = acode.require("codemirror");

	void config.SUPPORTED_EDITOR;
	void helpers.uuid();
	void cm.view.EditorView;
	void webview.create;

	if (fileIndex.supports("file:///sdcard/project")) {
		const page = await fileIndex.query({
			roots: ["file:///sdcard/project"],
			text: "main",
			limit: 50,
		});
		void page.entries;
		void page.hasMore;
	}
	void fileList.deprecated;
	void fileList.replacement;

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
		pinned: false,
	});

	const active = editorManager.activeFile;
	if (active) {
		active.setPinnedState(true, { reorder: true });
		active.togglePinned();
	}

	void editorManager.panes;
	void editorManager.activePane;
	void editorManager.splitPaneRight;
	void editorManager.restartLsp;
	await editorManager.flushCacheWrites();

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

	const workerServer = lsp.defineServer({
		id: "example-worker-server",
		label: "Example Worker Server",
		languages: ["html"],
		runtimes: ["example-web-worker"],
		transport: { kind: "external" },
		startupTimeout: 15_000,
	});
	lsp.upsert(workerServer);

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

	lsp.registerRuntimeProvider({
		id: "example-web-worker",
		label: "Example Web Worker",
		canHandle(server) {
			return server.id === "example-worker-server";
		},
		async checkInstallation() {
			return {
				status: "present",
				version: "bundled",
				canInstall: false,
				canUpdate: false,
			};
		},
		async start(server, context) {
			const handle = lsp.workers.createTransport({
				url: "https://example.invalid/worker.js",
				name: "example-lsp-worker",
				serverId: server.id,
				startupTimeout: server.startupTimeout,
				configure: {
					kind: "configure",
					serverId: server.id,
					rootUri: context.originalRootUri ?? context.rootUri ?? null,
					initializationOptions: server.initializationOptions ?? {},
				},
				hostHandlers: {
					readFile: async (params) => String(params.uri ?? ""),
				},
			});
			const transport: Acode.LspMessageTransport = handle.transport;
			transport.subscribe(() => {});
			return {
				kind: "transport",
				providerId: "example-web-worker",
				transport: handle,
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
