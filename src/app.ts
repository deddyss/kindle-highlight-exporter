import puppeteer, { HTTPRequest, HTTPResponse } from "puppeteer";
import path from "path";
import fs from "fs";
import { getChromeExecutablePath, getChromeUserDataDir } from "@/util";

const main = async () => {
	const browser = await puppeteer.launch({
		// headless: false,
		// defaultViewport: null,
		executablePath: getChromeExecutablePath() as string,
		userDataDir: getChromeUserDataDir() as string
	});

	console.log("open new page");
	const [ page ] = await browser.pages();
	const url = "https://read.amazon.com.au/notebook";

	const requestResponse: any[] = [];
	const requestHandler = (request: HTTPRequest) => {
		if (request.resourceType() !== "xhr" || !request.url().startsWith(url)) {
			return;
		}
		const item = {
			"type": "request",
			"url": request.url(),
			"resourceType": request.resourceType(),
			"redirectChain": request.redirectChain().length
		};
		requestResponse.push(item);
	};
	let counter = 0;
	const responseHandler = async (response: HTTPResponse) => {
		const request = response.request();
		if (request.resourceType() !== "xhr" || !request.url().startsWith(url)) {
			return;
		}
		const item = {
			"type": "response",
			"url": response.url(),
			"status": response.status()
		};
		requestResponse.push(item);
		await response.text();
		counter+=1;
		console.log(counter);
	};

	console.log("goto " + url);
	await page.goto(url, { waitUntil: "networkidle0" });

	page.on("request", requestHandler);
	page.on("response", responseHandler);

	await page.click("div[id=B0031R5K8G] a");
	// console.log("capture screen");
	// const output: string = path.join(path.resolve(__dirname, "../output"), "amazon-screenshot.jpg")
	// await page.screenshot({path: output, type: "jpeg", quality: 50, fullPage: true });

	await page.waitForNetworkIdle();

	page.off("request", requestHandler);
	page.off("response", responseHandler);

	// const output: string = path.join(path.resolve(__dirname, "../output"), "amazon-authenticated-content.html");
	// const content = await page.content();
	// fs.writeFileSync(output, content, { encoding: "utf-8" });

	const log: string = path.join(path.resolve(__dirname, "../output"), "retrieve-highlight-log.json");
	fs.writeFileSync(log, JSON.stringify(requestResponse), { encoding: "utf-8" });

	console.log("all highlights is retrieved");
	console.log("current URL: " + urlObject(page.url()));

	// console.log("goto google.com");
	// await page.goto("https://www.google.com/");

	// await page.waitForNetworkIdle();
	// console.log("google.com is loaded");

	// await page.waitForTimeout(1000);
	// await page.click("input[type=email][name=email]");
	// await page.keyboard.type("who@are.you");

	// await page.waitForTimeout(1000);
	// await page.click("input[type=password][name=password]");
	// await page.keyboard.type("password");

	// await page.waitForTimeout(1000);
	// await page.click("input[type=checkbox][name=rememberMe]");

	// await page.waitForTimeout(1000);
	// await page.click("input[type=submit][id=signInSubmit]");
	// await page.waitForNavigation();

	// console.log("current URL: " + urlObject(page.url()));

	await page.waitForTimeout(10000);

	await page.close();
	await browser.close();
};

const urlObject = (str: string) => {
	const url: URL = new URL(str);
	const { host, pathname } = url;
	return JSON.stringify({ host, pathname });
}

main();