import { Question } from "inquirer";
import chalk from "chalk";
import { Answer } from "@/types";
import { prefix, suffix } from "./options";

const savePreferencesQuestion = (name: string): Question<Answer> => ({
	type: "confirm",
	name: "savePreferences",
	message: `Hi ${name}, would you like to ${chalk.bold.yellow("save")} your current ${chalk.bold.yellow("preferences")} (except for email and password) so next time you don't have to start over`,
	default: true,
	prefix,
	suffix
});

export default savePreferencesQuestion;
