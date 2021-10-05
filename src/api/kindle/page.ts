import { SELECTOR } from "@/reference";
import { Book } from "@/types";

export const extractAnnotatedBooks = (): Array<Book> => {
	const fixAuthor = (author: string | null | undefined) => author && author.startsWith("By: ") ?
		author.substr(4) : author;
	const parseDate = (str: string | null | undefined) => str ? new Date(str + " UTC") : new Date(); 

	const books: Array<Book> = [];
	const elements:NodeListOf<HTMLElement> = document.querySelectorAll(SELECTOR.BOOKS);
	elements.forEach((element: HTMLElement) => {
		const id = element.getAttribute("id");
		const title = element.querySelector(SELECTOR.BOOK.TITLE)?.textContent;
		if (id && title) {
			const author = fixAuthor(element.querySelector(SELECTOR.BOOK.AUTHOR)?.textContent);
			const cover = element.querySelector(SELECTOR.BOOK.COVER)?.getAttribute("src");
			const lastAccess = parseDate(
				element.querySelector(SELECTOR.BOOK.LAST_ACCESS)?.getAttribute("value")
			);
			books.push({ id, title, author, cover, lastAccess });
		}
	});

	return books;
};

export const hasEmailAndPasswordInput = (): boolean => {
	const email = document.querySelector(SELECTOR.SIGNIN.EMAIL);
	const password = document.querySelector(SELECTOR.SIGNIN.PASSWORD);

	if (email && password) {
		return true;
	}
	return false;
};

export const extractSignInErrorMessage = (): string => {
	const element = document.querySelector(SELECTOR.SIGNIN.ERROR);
	if (element) {
		return element.textContent as string;
	}
	return "Unable to retrieve sign-in error message";
};
