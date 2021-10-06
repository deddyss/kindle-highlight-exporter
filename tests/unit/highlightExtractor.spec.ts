import path from "path";
import fs from "fs";
import { extractHighlights } from "@/api/kindle/dom";

describe("Kindle book highlights", () => {
	test("Check extracted highlights", () => {
		const html0 = fs.readFileSync(
			path.join(__dirname, "./highlightExtractor.html.0.txt"), "utf-8"
		);
		const html1 = fs.readFileSync(
			path.join(__dirname, "./highlightExtractor.html.1.txt"), "utf-8"
		);
		const highlights0 = extractHighlights(html0);
		const highlights1 = extractHighlights(html1);
		// console.table(highlights0);
		// console.table(highlights1);

		expect(highlights0.length).toBeGreaterThan(0);
		expect(highlights1.length).toBeGreaterThan(0);
	});
});
