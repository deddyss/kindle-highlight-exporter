/**
 * @jest-environment jsdom
 */

import path from "path";
import fs from "fs";
import { elementExists, extractTextContent } from "@/api/kindle/page";
import { SELECTOR } from "@/reference";

describe("Kindle sign-in error", () => {
	test("Unknown email account", () => {
		window.document.body.innerHTML = fs.readFileSync(
			path.join(__dirname, "./signIn.html.unknownEmail.txt"), "utf-8"
		);
		const errorMessage = extractTextContent(SELECTOR.SIGNIN.ERROR);
		expect(errorMessage).toContain("cannot find an account with that email");
	});

	test("Incorrect password", () => {
		window.document.body.innerHTML = fs.readFileSync(
			path.join(__dirname, "./signIn.html.incorrectPassword.txt"), "utf-8"
		);
		const errorMessage = extractTextContent(SELECTOR.SIGNIN.ERROR);
		expect(errorMessage).toContain("password is incorrect");
	});

	test("Captcha detected", () => {
		window.document.body.innerHTML = fs.readFileSync(
			path.join(__dirname, "./signIn.html.captcha.txt"), "utf-8"
		);
		const captchaDetected = elementExists(SELECTOR.SIGNIN.CAPTCHA);
		expect(captchaDetected).toBe(true);
	});
});
