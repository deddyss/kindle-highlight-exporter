import { CheckboxChoiceOptions, CheckboxQuestionOptions, Separator } from "inquirer";
import chalk from "chalk";
import { Answer, Book } from "@/types";
import { prefix } from "./options";

const setPrefixNumber = (choices: CheckboxChoiceOptions[]): void => {
	const padLength = choices.length.toString().length;
	choices.forEach((choice: CheckboxChoiceOptions, index: number) => {
		const number = ((index + 1) + "").padStart(padLength, "0");
		choice.name = `${number}. ${choice.name}`;
	});
};

const booksToChoiceOptions = (books: Book[], answer: Answer): CheckboxChoiceOptions[] => {
	let choices: any[] = [];
	books.forEach((book: Book) => {
		let checked = false;
		if (answer.lastSelectedBooks && answer.lastSelectedBooks.includes(book.id)) {
			checked = true;
		}
		choices.push({
			name: `${book.title} (by ${book.author})`,
			short: book.title,
			value: book.id,
			checked
		} as CheckboxChoiceOptions);
	});
	choices.sort((a: CheckboxChoiceOptions, b: CheckboxChoiceOptions) => {
		if (a.name && b.name) {
			return a.name.localeCompare(b.name);
		}
		return 0;
	});
	setPrefixNumber(choices);
	choices.push(new Separator("─".repeat(80)));
	return choices;
};

const message = (books: Book[], answer: Answer): string => {
	return `You have ${chalk.bold.yellow(books.length)} annotated book(s). ` 
		+ `Please ${chalk.bold.yellow("select")} the ${chalk.bold.yellow("book")} you want to export the highlight below`
};

const selectBooksQuestion = (books: Book[], answer: Answer): CheckboxQuestionOptions<Answer> => ({
	type: "checkbox",
	name: "selectedBooks",
	message: message(books, answer),
	choices: booksToChoiceOptions(books, answer),
	suffix: chalk.bold.cyan("!"),
	validate: (input?: string[]) => {
		return input?.length === 0 ? "You must select at least one book before continue" : true;
	},
	prefix
});

export default selectBooksQuestion;
