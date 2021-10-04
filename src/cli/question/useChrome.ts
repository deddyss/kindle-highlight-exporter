import { ListQuestionOptions } from "inquirer";
import chalk from "chalk";
import { Answer } from "@/types";
import { prefix } from "./options";

const useChromeQuestion: ListQuestionOptions<Answer> = {
	type: "list",
	name: "useChrome",
	message: `Do you want to ${chalk.bold.yellow("use Chrome")} as default tool to crawl Amazon Kindle?`,
	default: false,
	choices: [
		{
			name: "Yes, I want to use installed Chrome browser",
			short: "Chrome",
			value: true
		},
		{
			name: "No, I will use Chromium",
			short: "Chromium",
			value: false
		}
	],
	prefix
};

export default useChromeQuestion;
