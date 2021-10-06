import { Configuration } from "@/types";
import { getChromeExecutablePath, getChromeUserDataDir } from "@/util";
import puppeteer, { Browser, Page } from "puppeteer";

export const launchBrowser = async (config: Configuration): Promise<{ browser: Browser, page: Page }> => {
	const browser: Browser = await puppeteer.launch({
		// TODO:
		// headless: false,
		defaultViewport: null,
		executablePath: config.useChrome ? getChromeExecutablePath() : undefined,
		userDataDir: config.useChrome ? getChromeUserDataDir() : undefined
	});
	const pages: Page[] = await browser.pages();
	const page = pages[0];
	return { 
		browser,
		page
	};
};

export const close = async (param: { browser?: Browser, page?: Page }): Promise<void> => {
	if (param.page) {
		await param.page.close();
	}
	if (param.browser) {
		await param.browser.close();
	}
};
