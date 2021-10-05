import { JSDOM } from "jsdom";
import { SELECTOR } from "@/reference";
import { Highlight } from "@/types";

export const extractHighlights = (html: string): Array<Highlight> => {
	const { document } = (new JSDOM(html)).window;

	const highlights: Array<Highlight> = [];
	const elements: NodeListOf<HTMLElement> = document.querySelectorAll(SELECTOR.HIGHLIGHTS);
	elements.forEach((element: HTMLElement) => {
		const text = element.querySelector(SELECTOR.HIGHLIGHT.TEXT)?.textContent;
		if (text) {
			const note = element.querySelector(SELECTOR.HIGHLIGHT.NOTE)?.textContent;
			if (note) {
				highlights.push({ text, note });
			}
			else {
				highlights.push({ text });
			}
		}
	});

	return highlights;
};
