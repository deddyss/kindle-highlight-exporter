import path from "path";
import fs from "fs";
import pino, { Logger } from "pino";
import { DIRECTORY } from "@/reference";

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

export const isNotEmpty = (array: Array<any>): boolean => array && array.length > 0;

export const sleep = (delay: number = 0): Promise<void> => {
	return new Promise((resolve) => {
		if (delay > 0) {
			setTimeout(() => {
				resolve();
			}, delay);
		}
		else {
			resolve();
		}
	});
};

export const sanitizeFileName = (fileName: string): string => {
	return fileName.replace(/[/\\?%*:|"<>]/g, "").replace(/\s{2,}/g, " ").trim();
};

export const safeCurrentDateTimePathName = (): string => {
	const now = new Date();
	const offset = now.getTimezoneOffset() * 60 * 1000;
	const localDate = new Date(now.getTime() - offset);
	const result = localDate.toISOString().slice(0, 19).replace(/:/g, ".").replace("T", " ");

	return result;
};

export const createOutputDirectory = (name: string): string => {
	const directoryPath = path.join(DIRECTORY.OUTPUT, name);
	if (!fs.existsSync(directoryPath)) {
		fs.mkdirSync(directoryPath, { recursive: true });
	}
	return directoryPath;
};

export const createLogFile = (name: string): string => {
	const filePath = path.join(DIRECTORY.LOG, name.endsWith(".log") ? name : name.concat(".log"));
	if (!fs.existsSync(DIRECTORY.LOG)) {
		fs.mkdirSync(DIRECTORY.LOG, { recursive: true });
	}
	if (!fs.existsSync(filePath)) {
		// create empty log file
		fs.closeSync(fs.openSync(filePath, "w"));
	}
	return filePath;
};

export const createLogger = (filePath: string): Logger => {
	const destination = pino.destination(filePath);
	const logger = pino(
		{
			prettyPrint: {
				colorize: false,
				translateTime: "SYS:yyyy-mm-dd HH:MM:ss.l"
			},
			level: "trace",
			redact: ["*.amazonEmail", "*.amazonPassword"]
		},
		destination
	);
	return logger;
};
