import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const sourceRoot = resolve(import.meta.dir, "..", "src");

function listEntries(directory: string) {
	return readdirSync(directory).sort((left, right) =>
		left.localeCompare(right, "en"),
	);
}

function syncDirectory(directory: string) {
	const references: string[] = [];

	for (const entry of listEntries(directory)) {
		const absolutePath = join(directory, entry);

		if (statSync(absolutePath).isDirectory()) {
			syncDirectory(absolutePath);
			references.push(`/// <reference path="./${entry}/index.d.ts" />`);
			continue;
		}

		if (!entry.endsWith(".d.ts") || entry === "index.d.ts") {
			continue;
		}

		references.push(`/// <reference path="./${entry}" />`);
	}

	const output = references.length ? `${references.join("\n")}\n` : "";
	writeFileSync(join(directory, "index.d.ts"), output, "utf8");
}

syncDirectory(sourceRoot);
