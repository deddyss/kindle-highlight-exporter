import { ChoiceOptions, ListQuestionOptions } from "inquirer";
import chalk from "chalk";
import { prefix, suffix } from "./options";
import { REGIONS } from "@/reference";
import { Answer } from "@/types";

const DEFAULT_REGION = "amazon.com";

const referenceToChoiceOptions = (): ChoiceOptions[] => {
	return Object.keys(REGIONS).map(
		(value: string) => ({
			name: (REGIONS as Record<string, string>)[value],
			value,
			short: value
		} as ChoiceOptions)
	);
};

const amazonRegionQuestion: ListQuestionOptions<Answer> = {
	type: "list",
	name: "amazonRegion",
	message: `What is your preferred ${chalk.bold.yellow("Amazon region")} website:`,
	default: DEFAULT_REGION,
	choices: referenceToChoiceOptions(),
	prefix,
	suffix
};

export default amazonRegionQuestion;
