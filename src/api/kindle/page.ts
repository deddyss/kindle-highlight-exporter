import { Book, BookSelector } from "@/types";

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

export const extractAnnotatedBooks = (selector: BookSelector): Array<Book> => {
	const fixAuthor = (author: string | null | undefined) => author && author.startsWith("By: ") ?
		author.substr(4) : author;
	const parseDate = (str: string | null | undefined) => str ? new Date(str + " UTC") : new Date();
	const dateToString = (date: Date) => date.toISOString().slice(0,10);

	const books: Array<Book> = [];
	const elements:NodeListOf<HTMLElement> = document.querySelectorAll(selector.books);
	elements.forEach((element: HTMLElement) => {
		const id = element.getAttribute("id");
		const title = element.querySelector(selector.title)?.textContent;
		if (id && title) {
			const author = fixAuthor(element.querySelector(selector.author)?.textContent);
			const cover = element.querySelector(selector.cover)?.getAttribute("src");
			const lastAccess = dateToString(
				parseDate(
					element.querySelector(selector.lastAccess)?.getAttribute("value")
				)
			);
			books.push({ id, title, author, cover, lastAccess });
		}
	});

	return books;
};

export const highlightsCountHasValidValue = (selector: string): boolean => {
	const element = document.querySelector(selector);
	if (element && element.textContent) {
		const value = element.textContent.trim();
		return value !== "--" && /^\d+$/.test(value);
	}
	return false;
};
