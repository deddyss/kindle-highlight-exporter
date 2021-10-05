/**
 * @jest-environment jsdom
 */

import path from "path";
import fs from "fs";
import { extractAnnotatedBooks } from "@/api/kindle/page";

describe("Kindle annotated books", () => {
	/**
	 * Load HTML and simulate a DOM environment
	 */
	beforeAll(() => {
		window.document.body.innerHTML = fs.readFileSync(
			path.join(__dirname, "./bookExtractor.test.html"), "utf-8"
		);
	});

	test("Verify HTML title", () => {
		expect(document.title).toEqual("Kindle: Your Notes and Highlights");
	});

	test("Check extracted books", () => {
		const books = extractAnnotatedBooks();
		// console.table(books);
		expect(books.length).toBeGreaterThan(0);
	});
});
