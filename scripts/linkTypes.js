const { readdirSync, statSync, writeFileSync, readFileSync } = require("node:fs");
const { resolve, join, relative } = require("node:path");

const BASE_DIR = resolve(__dirname, "../src");
const ROOT_INDEX = resolve(__dirname, "../index.d.ts");

const collectedTypes = new Set();

function extractTypesFromNamespace(content) {
	const interfaceMatches = content.matchAll(/^\t(interface|type)\s+(\w+)/gm);
	for (const match of interfaceMatches) {
		collectedTypes.add(match[2]);
	}
}

function linkTypes(path) {
	const refs = [];
	for (const p of readdirSync(path)) {
		const fullPath = join(path, p);
		if (statSync(fullPath).isDirectory()) {
			linkTypes(fullPath);
			refs.push(`/// <reference path="./${p}/index.d.ts" />`);
		} else {
			if (p !== "index.d.ts" && p !== "test.ts") {
				refs.push(`/// <reference path="./${p}" />`);

				const content = readFileSync(fullPath, "utf-8");
				if (content.includes("declare namespace Acode") || content.includes("namespace Acode")) {
					extractTypesFromNamespace(content);
				}
			}
		}
	}
	writeFileSync(join(path, "index.d.ts"), `${refs.join("\n")}\n`);
}

function generateModuleExports() {
	const sortedTypes = [...collectedTypes].sort();

	const exports = sortedTypes.map((t) => `\texport type ${t} = Acode.${t};`).join("\n");

	return `declare module "acode" {\n${exports}\n}`;
}

function generateRootIndex() {
	const refs = [
		'/// <reference path="./src/index.d.ts" />',
		'/// <reference path="./types/ace/index.d.ts" />',
		'/// <reference path="./types/require.d.ts" />',
		'/// <reference path="./types/xterm.d.ts" />',
		'/// <reference path="./types/html-tag-js.d.ts" />',
	];

	const moduleExports = generateModuleExports();

	return `${refs.join("\n")}\n\n${moduleExports}\n`;
}

linkTypes(BASE_DIR);

const rootContent = generateRootIndex();
writeFileSync(ROOT_INDEX, rootContent);

console.log("✓ Linked types in src/");
console.log(`✓ Generated ${collectedTypes.size} type exports in declare module "acode"`);
console.log("✓ Updated index.d.ts");
