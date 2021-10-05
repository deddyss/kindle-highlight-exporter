/**
 * @jest-environment jsdom
 */

import path from "path";
import fs from "fs";
import { extractAnnotatedBooks, extractSignInErrorMessage } from "@/api/kindle/page";

describe("Kindle sign-in error", () => {
	test("Unknown email account", () => {
		window.document.body.innerHTML = fs.readFileSync(
			path.join(__dirname, "./signIn.test.unknownEmail.html"), "utf-8"
		);
		const errorMessage = extractSignInErrorMessage();
		expect(errorMessage).toContain("cannot find an account with that email");
	});

	test("Incorrect password", () => {
		window.document.body.innerHTML = fs.readFileSync(
			path.join(__dirname, "./signIn.test.incorrectPassword.html"), "utf-8"
		);
		const errorMessage = extractSignInErrorMessage();
		expect(errorMessage).toContain("password is incorrect");
	});
});
