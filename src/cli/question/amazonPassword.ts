import { PasswordQuestionOptions } from "inquirer";
import chalk from "chalk";
import { prefix, suffix } from "./options";

const amazonPasswordQuestion: PasswordQuestionOptions = {
	type: "password",
	mask: "*",
	name: "apiToken",
	message: `What is your ${chalk.bold.yellow("password")}`,
	validate: (input?: string) => {
		if (input) {
			return true;
		}
		return "You must provide your password before proceeding";
	},
	prefix,
	suffix
};

export default amazonPasswordQuestion;
