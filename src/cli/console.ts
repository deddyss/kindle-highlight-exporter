import chalk from "chalk";

export const printNewLine = (): void => {
	console.log();
}

export const printOutputDirectoryPath = (directory: string): void => {
	console.log(`\n${chalk.bold.green("✔")} Exported hightlights are stored at ${directory}`);
};
