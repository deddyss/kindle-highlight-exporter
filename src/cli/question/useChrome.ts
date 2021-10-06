import { ListQuestionOptions } from "inquirer";
import chalk from "chalk";
import { Answer } from "@/types";
import { prefix } from "./options";

const useChromeQuestion: ListQuestionOptions<Answer> = {
	type: "list",
	name: "useChrome",
	message: `Do you want to ${chalk.bold.yellow("use installed Chrome")} as default tool to crawl your Kindle books${chalk.bold.cyan("?")} You might not need to enter username and password again if you're already authenticated to Amazon on Chrome`,
	default: true,
	choices: [
		{
			name: "Yes, I want to use Chrome",
			short: "Chrome",
			value: true
		},
		{
			name: "No, I want to use built-in Chromium and willing to provide email and password for authentication",
			short: "Chromium",
			value: false
		}
	],
	prefix
};

export default useChromeQuestion;
