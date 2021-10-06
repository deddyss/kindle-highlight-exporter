import { prompt, QuestionCollection } from "inquirer";
import { Browser, Page } from "puppeteer";
import { close, launchBrowser } from "./api/browser";
import Kindle from "./api/kindle";
import { writeBookToFile } from "./api/kindle/book";
import { printNewLine, printOutputDirectoryPath } from "./cli/console";
import useChromeQuestion from "./cli/question/useChrome";
import amazonRegionQuestion from "./cli/question/amazonRegion";
import loadPreferencesQuestion from "./cli/question/loadPreferences";
import amazonEmailQuestion from "./cli/question/amazonEmail";
import amazonPasswordQuestion from "./cli/question/amazonPassword";
import selectBooksQuestion from "./cli/question/selectBooks";
import savePreferencesQuestion from "./cli/question/savePreferences";
import { greeting, info } from "./cli/statement";
import createProgressBar from "./cli/progressBar";
import spinner from "./cli/spinner";
import { Answer, Book, ProgressBar } from "./types";
import { createOutputDirectory, isChromeAvailable, isNotEmpty, safeCurrentDateTimePathName, sleep } from "./util";
import { deletePreferences, isPreferencesExist, loadPreferences, savePreferences, showPreferences } from "./util/preferences";

const showGreetingAndInformation = async () => {
	console.clear();
	console.log(greeting);
	await sleep(500);

	console.log(info);
	await sleep(500);
};

const ask = (questions: QuestionCollection, initialAnswer?: Answer): Promise<Answer> => {
	return prompt<Answer>(questions, initialAnswer);
};

const openKindleNotebook = async (kindle: Kindle, answer: Answer): Promise<boolean> => {
	spinner.start("Opening your Kindle notebook");
	let signedIn: boolean = await kindle.openNotebook();
	if (!signedIn) {
		spinner.fail("You're not signed-in yet");
		// ask email and password
		answer = await ask([amazonEmailQuestion, amazonPasswordQuestion], answer);
		kindle.updateConfiguration(answer);
		
		spinner.start("Signing in")
		let error: string | undefined;
		({ signedIn, error } = await kindle.signIn());
		// still not signed-in
		if (!signedIn) {
			spinner.fail(error ? error : "Cannot sign-in to Amazon with provided email and password");
			return false;
		}
	}
	spinner.stop();
	return true;
};

const handlePreferences = (answer: Answer): void => {
	if (answer.savePreferences === true) {
		savePreferences(answer);
	}
	else {
		deletePreferences();
	}
};

const main = async () => {
	let answer: Answer = {};
	let browser!: Browser;
	let page!: Page;
	let kindle: Kindle, books: Book[];

	try {
		await showGreetingAndInformation();

		if (isPreferencesExist()) {
			answer = await ask([loadPreferencesQuestion], answer);
			if (answer.loadPreferences) {
				// load preferences
				const preferences = loadPreferences();
				showPreferences(preferences);
				// merge answer
				answer = { ...answer, ...preferences, ...{ savePreferences: true } };
			}
		}

		// browser preference isn't set yet
		if (answer.useChrome === undefined && isChromeAvailable()) {
			answer = await ask([useChromeQuestion], answer);
		}

		// ask amazon website region
		answer = await ask([amazonRegionQuestion], answer);

		// launch browser and get page
		({ browser, page } = await launchBrowser(answer));

		// init kindle
		kindle = new Kindle(page, answer);

		const notebookOpened: boolean = await openKindleNotebook(kindle, answer);
		if (!notebookOpened) {
			return;
		}

		// get username
		const username = await kindle.getUsername();
		// ask if user wants to save preferences
		answer = await ask([savePreferencesQuestion(username)], answer);

		books = await kindle.getBooks();
		if (isNotEmpty(books)) {
			// ask user to select some books
			answer = await ask([selectBooksQuestion(books, answer)], answer);
		}
		else {
			spinner.fail(`You don't have any annotated books`);
			handlePreferences(answer);
			return;
		}

		handlePreferences(answer);

		// create output directory to store hightlights
		const uniquePathName: string = safeCurrentDateTimePathName();
		const outputDirectory = createOutputDirectory(uniquePathName);

		printNewLine();
		const progressBar: ProgressBar = createProgressBar();
		progressBar.start(books.length, 0);

		for (const book of books) {
			book.hightlights = await kindle.getHighlights(book.id);
			writeBookToFile(book, outputDirectory);

			progressBar.increment();
			sleep(1000);
		}
		progressBar.stop();

		printOutputDirectoryPath(outputDirectory);
	}
	catch (error) {
		if (error) {
			console.error(error);
		}
	}
	finally {
		await close({ page, browser })
	}
};

main();