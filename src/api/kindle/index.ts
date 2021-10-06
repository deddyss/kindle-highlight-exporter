import { HTTPRequest, HTTPResponse, Page } from "puppeteer";
import { render } from "mustache";
import { SignInResult, Configuration, Highlight, Book } from "@/types";
import { SELECTOR } from "@/reference";
import { elementExists, extractAnnotatedBooks, extractSignInErrorMessage, extractUsername, hasEmailAndPasswordInput } from "./page";
import { extractHighlights } from "./dom";

class Kindle {
	private config: Configuration;
	private page: Page;
	private notebookUrl: string;
	private signInUrl: string;

	constructor (page: Page, config: Configuration) {
		this.page = page;
		this.config = config;
		this.notebookUrl = `https://read.${config.amazonRegion}/notebook`;
		this.signInUrl = `https://www.${config.amazonRegion}/ap/signin`;
	}

	public updateConfiguration(config: Configuration) {
		this.config = config;
	}

	public async openNotebook (): Promise<boolean> {
		await this.page.goto(this.notebookUrl, { waitUntil: "networkidle0" });
		
		if (this.page.url() !== this.notebookUrl) {
			return false;
		}
		return true;
	};

	public async signIn(delay: number = 500): Promise<SignInResult> {
		const result: SignInResult = { signedIn: true }; 
		const onSignInPage = await this.page.evaluate(hasEmailAndPasswordInput);
	
		if (!onSignInPage) {
			result.signedIn = false;
			result.error = "Invalid sign in form";
			return result;
		}
	
		if (this.config.amazonEmail === undefined || this.config.amazonPassword === undefined) {
			result.signedIn = false;
			result.error = "Undefined email and/or password";
			return result;
		}
	
		await this.page.click(SELECTOR.SIGNIN.EMAIL);
		await this.page.keyboard.type(this.config.amazonEmail);
		await this.page.waitForTimeout(delay);
	
		await this.page.click(SELECTOR.SIGNIN.PASSWORD);
		await this.page.keyboard.type(this.config.amazonPassword);
		await this.page.waitForTimeout(delay);
	
		if (this.config.keepSignIn) {
			await this.page.click(SELECTOR.SIGNIN.REMEMBER_ME);
			await this.page.waitForTimeout(delay);
		}
	
		await this.page.click(SELECTOR.SIGNIN.SUBMIT);
		await this.page.waitForNavigation();
	
		// still on sign-in page after navigation, it could be an authentication error
		if (this.page.url().startsWith(this.signInUrl)) {
			result.signedIn = false;
			result.error = await this.page.evaluate(extractSignInErrorMessage);
		}
	
		return result;
	}

	public async getUsername(): Promise<string> {
		const username = await this.page.evaluate(extractUsername);
		return username;
	}

	public async getBooks(): Promise<Array<Book>> {
		const books = await this.page.evaluate(extractAnnotatedBooks);
		return books;
	}

	public async getHighlights(id: string): Promise<Array<Highlight>> {
		const bookLinkSelector = render(SELECTOR.BOOK.LINK, { id });
		const bookLinkExists = await this.page.evaluate(elementExists, bookLinkSelector);
		if (!bookLinkExists) {
			return [];
		}
	
		const requestHighlightUrl: string = `${this.notebookUrl}?asin=${id}`;
		const highlights: Array<Highlight> = [];
	
		const responseHandler = (response: HTTPResponse) => {
			const request: HTTPRequest = response.request();
			if (request.resourceType() !== "xhr" || !request.url().startsWith(requestHighlightUrl)) {
				return;
			}
			response.text().then((html: string) => {
				// merge highlights
				highlights.push(...extractHighlights(html));
			});
		};
		// register response handler
		this.page.on("response", responseHandler);
	
		await this.page.click(bookLinkSelector);
		await this.page.waitForNetworkIdle({ timeout: 0 });
	
		// unregister response handler
		this.page.off("response", responseHandler);
	
		return highlights;
	}
}

export default Kindle;
