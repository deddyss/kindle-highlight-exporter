import path from "path";
import fs from "fs";
import { Book } from "@/types";
import { sanitizeFileName } from "@/util";

const composeFilename = (book: Book) => {
	let filename = book.title;
	if (book.author) {
		filename = ` (By ${book.author})`;
	}
	filename += `.json`;
	return sanitizeFileName(filename);
};

export const writeBookToFile = (book: Book, directory: string) => {
	const filename = composeFilename(book);
	fs.writeFileSync(path.join(directory, filename), JSON.stringify(book), "utf-8");
};
