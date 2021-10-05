/**
	await page.click("input[type=email][name=email]");
	await page.keyboard.type("who@are.you");

	await page.waitForTimeout(1000);
	await page.click("input[type=password][name=password]");
	await page.keyboard.type("password");

	await page.waitForTimeout(1000);
	await page.click("input[type=checkbox][name=rememberMe]");

	// await page.waitForTimeout(1000);
	// await page.click("input[type=submit][id=signInSubmit]");
	// await page.waitForNavigation();

 */

export const SELECTOR = {
	SIGNIN: {
		EMAIL: "input[type=email][name=email]",
		PASSWORD: "input[type=password][name=password]",
		REMEMBER_ME: "input[type=checkbox][name=rememberMe]",
		SUBMIT: "input[type=submit][id=signInSubmit]",
		ERROR: "div[id=auth-error-message-box] span",
	},
	BOOKS: ".kp-notebook-library-each-book",
	BOOK: {
		TITLE: "h2",
		AUTHOR: "p",
		COVER: "img",
		LAST_ACCESS: "input[type=hidden]"
	},
	HIGHLIGHTS: ".kp-notebook-print-override",
	HIGHLIGHT: {
		TEXT: ".kp-notebook-highlight span",
		NOTE: ".kp-notebook-note span#note"
	}
};

export const REGIONS = {
	"amazon.com.au": "Australia",
	// "amazon.com.br": "Brazil",
	"amazon.ca": "Canada",
	// "amazon.com.tr": "Turkey",
	"amazon.co.jp": "Japan",
	// "amazon.cn": "China",
	// "amazon.eg": "Egypt",
	// "amazon.fr": "France",
	// "amazon.de": "Germany",
	"amazon.in": "India",
	// "amazon.it": "Italy",
	// "amazon.com.mx": "Mexico",
	// "amazon.nl": "Netherlands",
	// "amazon.pl": "Poland",
	// "amazon.sa": "Saudi Arabia",
	// "amazon.sg": "Singapore",
	// "amazon.es": "Spain",
	// "amazon.se": "Sweden",
	// "amazon.ae": "United Arab Emirates",
	"amazon.co.uk": "United Kingdom",
	"amazon.com": "United States (default)",
};
