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

	const requestResponse: any[] = [];
	const requestHandler = (request: HTTPRequest) => {
		const item = {
			"type": "request",
			"url": request.url(),
			"resourceType": request.resourceType(),
			"redirectChain": request.redirectChain().length
		};
		requestResponse.push(item);
	};
	const responseHandler = (response: HTTPResponse) => {
		const item = {
			"type": "response",
			"url": response.url(),
			"status": response.status()
		};
		requestResponse.push(item);
	};
	page.on("request", requestHandler);
	page.on("response", responseHandler);


	const url = "https://read.amazon.com.au/notebook";
	console.log("goto " + url);
	await page.goto(url, { waitUntil: "networkidle0" });


	// console.log("capture screen");
	// const output: string = path.join(path.resolve(__dirname, "../output"), "amazon-screenshot.jpg")
	// await page.screenshot({path: output, type: "jpeg", quality: 50, fullPage: true });

	await page.waitForNetworkIdle();

	page.off("request", requestHandler);
	page.off("response", responseHandler);

	const output: string = path.join(path.resolve(__dirname, "../output"), "amazon-authenticated-content.html");
	const content = await page.content();
	fs.writeFileSync(output, content, { encoding: "utf-8" });

	const log: string = path.join(path.resolve(__dirname, "../output"), "amazon-authenticated-log.json");
	fs.writeFileSync(log, JSON.stringify(requestResponse), { encoding: "utf-8" });

	console.log("amazon.com is loaded");
	console.log("current URL: " + page.url());

	// console.log("goto google.com");
	// await page.goto("https://www.google.com/");

	// await page.waitForNetworkIdle();
	// console.log("google.com is loaded");


	await page.close();
	await browser.close();
};

main();