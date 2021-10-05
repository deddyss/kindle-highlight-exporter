import { ListQuestionOptions } from "inquirer";
import chalk from "chalk";
import { Configuration } from "@/types";
import { prefix } from "./options";

const useChromeQuestion: ListQuestionOptions<Configuration> = {
	type: "list",
	name: "useChrome",
	message: `Do you want to ${chalk.bold.yellow("use installed Chrome")} as default tool to crawl your Kindle books${chalk.bold.cyan("?")} You might not need to enter username and password again if you're already authenticated to Amazon`,
	default: false,
	choices: [
		{
			name: "Yes, I want to use installed Chrome browser",
			short: "Chrome",
			value: true
		},
		{
			name: "No, I will use built-in Chromium browser",
			short: "Chromium",
			value: false
		}
	],
	prefix
};

export default useChromeQuestion;
