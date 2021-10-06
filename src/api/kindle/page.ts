import { Book, BookSelector } from "@/types";

export const extractAnnotatedBooks = (selector: BookSelector): Array<Book> => {
	const fixAuthor = (author: string | null | undefined) => author && author.startsWith("By: ") ?
		author.substr(4) : author;
	const parseDate = (str: string | null | undefined) => str ? new Date(str + " UTC") : new Date(); 

	const books: Array<Book> = [];
	const elements:NodeListOf<HTMLElement> = document.querySelectorAll(selector.books);
	elements.forEach((element: HTMLElement) => {
		const id = element.getAttribute("id");
		const title = element.querySelector(selector.title)?.textContent;
		if (id && title) {
			const author = fixAuthor(element.querySelector(selector.author)?.textContent);
			const cover = element.querySelector(selector.cover)?.getAttribute("src");
			const lastAccess = parseDate(
				element.querySelector(selector.lastAccess)?.getAttribute("value")
			);
			books.push({ id, title, author, cover, lastAccess });
		}
	});

	return books;
};

export const extractTextContent = (selector: string): string => {
	const element = document.querySelector(selector);
	return element?.textContent ?? "";
};

export const elementExists = (...selectors: string[]): boolean => {
	for (const selector of selectors) {
		const element = document.querySelector(selector);
		if (element === null) {
			return false;
		}
	}
	return true;
};
