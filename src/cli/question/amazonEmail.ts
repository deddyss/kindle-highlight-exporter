import { InputQuestionOptions } from "inquirer";
import { validate } from "email-validator";
import chalk from "chalk";
import { prefix, suffix } from "./options";

const amazonEmailQuestion: InputQuestionOptions = {
	type: "input",
	name: "apiToken",
	message: `What is your Amazon username (${chalk.bold.yellow("email")})`,
	validate: (input?: string) => {
		if (input) {
			return validate(input) || "Invalid email address";
		}
		return "You must provide your Amazon username (email) before proceeding";
	},
	prefix,
	suffix
};

export default amazonEmailQuestion;
