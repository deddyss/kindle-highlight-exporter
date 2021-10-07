import { HTTPRequest, HTTPResponse, Page } from "puppeteer";
import { render } from "mustache";
import { Logger } from "pino";
import { SignInResult, Configuration, Highlight, Book, BookSelector } from "@/types";
import { SELECTOR } from "@/reference";
import { extractHighlights } from "./dom";
import { elementExists, extractAnnotatedBooks, extractTextContent } from "./page";

class Kindle {
	private config: Configuration;
	private page: Page;
	private log: Logger;
	private notebookUrl: string;
	private signInUrl: string;

	constructor (page: Page, config: Configuration, log: Logger) {
		this.page = page;
		this.config = config;
		this.log = log;
		this.notebookUrl = `https://read.${config.amazonRegion}/notebook`;
		this.signInUrl = `https://www.${config.amazonRegion}/ap/signin`;
	}

	public updateConfiguration(config: Configuration) {
		this.config = config;
	}

	public async openNotebook (): Promise<boolean> {
		this.log.debug("opening %s", this.notebookUrl);
		await this.page.goto(this.notebookUrl, { waitUntil: "networkidle0" });
		
		if (this.page.url() !== this.notebookUrl) {
			this.log.warn("redirected to %s", this.page.url());
			return false;
		}
		return true;
	};

	public async signIn(delay: number = 500): Promise<SignInResult> {
		const result: SignInResult = { signedIn: true, captchaDetected: false };
		const onSignInPage = await this.page.evaluate(
			elementExists, SELECTOR.SIGNIN.EMAIL, SELECTOR.SIGNIN.PASSWORD
		);

		if (!onSignInPage) {
			this.log.error(
				"looks like the sign-in page is invalid because email and password fields are not detected"
			);

			result.signedIn = false;
			result.error = "Invalid sign-in form";
			return result;
		}
	
		if (this.config.amazonEmail === undefined || this.config.amazonPassword === undefined) {
			this.log.error("neither email nor password is provided");

			result.signedIn = false;
			result.error = "Undefined email and/or password";
			return result;
		}
	
		this.log.debug("signing in");

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
			result.captchaDetected = await this.page.evaluate(elementExists, SELECTOR.SIGNIN.CAPTCHA);
			result.error = await this.page.evaluate(extractTextContent, SELECTOR.SIGNIN.ERROR);

			this.log.error(
				"sign-in failed (reason: %s)",
				result.captchaDetected ? "captcha detected" : result.error
			);
		}
	
		return result;
	}

	public async getUsername(): Promise<string> {
		const username = await this.page.evaluate(extractTextContent, SELECTOR.USERNAME);
		this.log.debug("username: %s", username);

		return username;
	}

	public async getBooks(): Promise<Array<Book>> {
		this.log.debug("retrieving books");

		const selector: BookSelector = {
			books: SELECTOR.BOOKS,
			title: SELECTOR.BOOK.TITLE,
			author: SELECTOR.BOOK.AUTHOR,
			cover: SELECTOR.BOOK.COVER,
			lastAccess: SELECTOR.BOOK.LAST_ACCESS
		};
		const books = await this.page.evaluate(
			extractAnnotatedBooks, selector
		);
		this.log.debug("%d book(s) retrieved", books.length);

		return books;
	}

	public async getHighlights(id: string): Promise<Array<Highlight>> {
		this.log.debug("retrieving highlights for book %s", id);

		const bookLinkSelector = render(SELECTOR.BOOK.LINK, { id });
		const bookLinkExists = await this.page.evaluate(elementExists, bookLinkSelector);
		if (!bookLinkExists) {
			this.log.warn("link for book %s doesn't seem to exist", id);
			return [];
		}
	
		const requestHighlightPartialUrl: string = `/notebook?asin=${id}`;
		const highlights: Array<Highlight> = [];
		this.log.debug("valid highlight url should contain \"%s\"", requestHighlightPartialUrl);
	
		const responseHandler = (response: HTTPResponse) => {
			const request: HTTPRequest = response.request();
			const validHighlightUrl = request.url().includes(requestHighlightPartialUrl);
			if (request.resourceType() !== "xhr" || !validHighlightUrl) {
				if (!validHighlightUrl) {
					this.log.trace("skipped: %s", request.url());
				}
				return;
			}
			this.log.debug("waiting response from %s", request.url());
			response.text().then((html: string) => {
				const partialHighlights = extractHighlights(html);
				// merge highlights
				highlights.push(...partialHighlights);

				this.log.debug(
					"%d highlight(s) retrieved (total so far: %d) ",
					partialHighlights.length,
					highlights.length
				);
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
