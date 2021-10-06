import path from "path";
import app from "app-root-path";

export const DIRECTORY = {
	SETTING: path.join(app.path, "./setting"),
	OUTPUT: path.join(app.path, "./output"),
}

export const SELECTOR = {
	USERNAME: "div[id=kp-notebook-head] span.kp-notebook-username",
	SIGNIN: {
		EMAIL: "input[type=email][name=email]",
		PASSWORD: "input[type=password][name=password]",
		REMEMBER_ME: "input[type=checkbox][name=rememberMe]",
		SUBMIT: "input[type=submit][id=signInSubmit]",
		ERROR: "div[id=auth-error-message-box] span",
		CAPTCHA: "div[id=image-captcha-section]"
	},
	BOOKS: ".kp-notebook-library-each-book",
	BOOK: {
		TITLE: "h2",
		AUTHOR: "p",
		COVER: "img",
		LAST_ACCESS: "input[type=hidden]",
		LINK: "div[id={{id}}] a"
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
