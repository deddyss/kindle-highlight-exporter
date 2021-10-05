import path from "path";
import fs from "fs";

export const isChromeAvailable = (): boolean => {
	return getChromeExecutablePath() !== undefined;
};

export const getChromeExecutablePath = () => {
	if (process.platform !== "win32") {
		return undefined;
	}

	const prefixes = [
		process.env.LOCALAPPDATA,
		process.env.PROGRAMFILES,
		process.env["PROGRAMFILES(X86)"],
	];
	const suffix = "\\Google\\Chrome\\Application\\chrome.exe";

	for (const prefix of prefixes) {
		try {
			let chromePath = path.join(prefix as string, suffix);
			fs.accessSync(chromePath);
			return chromePath;
		}
		catch (error) {}
	}

	return undefined;
};

export const getChromeUserDataDir = () => {
	if (process.platform !== "win32") {
		return undefined;
	}

	const prefix = process.env.LOCALAPPDATA;
	const suffixes = [
		"\\Google\\Chrome\\User Data",
		"\\Google\\Chrome Beta\\User Data",
		"\\Google\\Chrome SxS\\User Data",
		"\\Chromium\\User Data"
	];

	for (const suffix of suffixes) {
		try {
			let chromePath = path.join(prefix as string, suffix);
			fs.accessSync(chromePath);
			return chromePath;
		}
		catch (error) {}
	}

	return undefined;
};
