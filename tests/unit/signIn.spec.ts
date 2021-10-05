/**
 * @jest-environment jsdom
 */

import path from "path";
import fs from "fs";
import { extractSignInErrorMessage } from "@/api/kindle/page";

describe("Kindle sign-in error", () => {
	test("Unknown email account", () => {
		window.document.body.innerHTML = fs.readFileSync(
			path.join(__dirname, "./signIn.html.unknownEmail.txt"), "utf-8"
		);
		const errorMessage = extractSignInErrorMessage();
		expect(errorMessage).toContain("cannot find an account with that email");
	});

	test("Incorrect password", () => {
		window.document.body.innerHTML = fs.readFileSync(
			path.join(__dirname, "./signIn.html.incorrectPassword.txt"), "utf-8"
		);
		const errorMessage = extractSignInErrorMessage();
		expect(errorMessage).toContain("password is incorrect");
	});
});
