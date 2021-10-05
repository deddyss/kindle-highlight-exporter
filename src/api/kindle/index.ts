import puppeteer, { Browser, Page } from "puppeteer";
import { SignInResult, Configuration } from "@/types";
import { getChromeExecutablePath, getChromeUserDataDir } from "@/util";
import { SELECTOR } from "@/reference";
import { extractAnnotatedBooks, extractSignInErrorMessage, hasEmailAndPasswordInput } from "./page";

let browser: Browser, page: Page;

export const launchBrowser = async (config: Configuration) => {
	if (browser !== undefined) {
		return;
	}

	browser = await puppeteer.launch({
		// headless: false,
		defaultViewport: null,
		executablePath: config.useChrome ? getChromeExecutablePath() : undefined,
		userDataDir: config.useChrome ? getChromeUserDataDir() : undefined
	});
	[ page ] = await browser.pages();
};

export const openNotebook = async (config: Configuration) => {
	await launchBrowser(config);

	const url: string = `https://read.${config.amazonRegion}/notebook`;
	await page.goto(url, { waitUntil: "networkidle0" });
	
	if (page.url() !== url) {
		return false;
	}

	return true;
};

export const signIn = async (config: Configuration, delay: 500) => {
	const result: SignInResult = { signedIn: true }; 
	const signInUrl: string = `https://www.${config.amazonRegion}/ap/signin`;
	const onSignInPage = await page.evaluate(hasEmailAndPasswordInput);

	if (!onSignInPage) {
		result.signedIn = false;
		result.error = "Invalid sign in form";
		return result;
	}

	if (config.email === undefined || config.password === undefined) {
		result.signedIn = false;
		result.error = "Undefined email and/or password";
		return result;
	}

	await page.click(SELECTOR.SIGNIN.EMAIL);
	await page.keyboard.type(config.email);
	await page.waitForTimeout(delay);

	await page.click(SELECTOR.SIGNIN.PASSWORD);
	await page.keyboard.type(config.password);
	await page.waitForTimeout(delay);

	if (config.keepSignIn) {
		await page.click(SELECTOR.SIGNIN.REMEMBER_ME);
		await page.waitForTimeout(delay);
	}

	await page.click(SELECTOR.SIGNIN.SUBMIT);
	await page.waitForNavigation();

	// still on sign-in page after navigation, it means authentication error
	if (page.url().startsWith(signInUrl)) {
		result.signedIn = false;
		result.error = await page.evaluate(extractSignInErrorMessage);
	}

	return result;
};

export const getAnnotatedBooks = async () => {
	const books = await page.evaluate(extractAnnotatedBooks);
	return books;
};

export const closeBrowser = async () => {
	if (browser === undefined) {
		return;
	}

	await page.close();
	await browser.close();
};

