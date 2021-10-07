/**
 * @jest-environment jsdom
 */

import path from "path";
import fs from "fs";
import { extractAnnotatedBooks } from "@/api/kindle/page";
import { BookSelector } from "@/types";
import { SELECTOR } from "@/reference";

describe("Kindle annotated books", () => {
	/**
	 * Load HTML and simulate a DOM environment
	 */
	beforeAll(() => {
		window.document.body.innerHTML = fs.readFileSync(
			path.join(__dirname, "./bookExtractor.html.txt"), "utf-8"
		);
	});

	test("Verify HTML title", () => {
		expect(document.title).toEqual("Kindle: Your Notes and Highlights");
	});

	test("Check extracted books", () => {
		const selector: BookSelector = {
			books: SELECTOR.BOOKS,
			title: SELECTOR.BOOK.TITLE,
			author: SELECTOR.BOOK.AUTHOR,
			cover: SELECTOR.BOOK.COVER,
			lastAccess: SELECTOR.BOOK.LAST_ACCESS
		};
		const books = extractAnnotatedBooks(selector);
		// console.table(books);
		expect(books.length).toBeGreaterThan(0);
	});
});
