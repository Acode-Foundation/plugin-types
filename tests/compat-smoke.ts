async function acodeCompatibilitySmoke() {
	const commands = acode.require("commands");
	const editorLanguages = acode.require("editorLanguages");
	const editorThemes = acode.require("editorThemes");
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
				return view.state.doc.length >= 0;
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

	const newFile = acode.newEditorFile("example.ts", {
		text,
		editable: true,
	});

	newFile.setMode("typescript");

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
