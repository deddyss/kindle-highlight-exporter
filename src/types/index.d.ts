import { SingleBar } from "cli-progress";

export interface Preferences {
	useChrome?: boolean;
	amazonRegion?: string;
	lastSelectedBooks?: string[];
}

export interface Configuration extends Preferences {
	amazonEmail?: string;
	amazonPassword?: string;
	keepSignIn?: boolean;
	selectedBooks?: string[];
	loadPreferences?: boolean;
	savePreferences?: boolean;
}

export interface Answer extends Configuration {}

export interface SignInResult {
	signedIn: boolean;
	error?: string;
}

export interface Book {
	id: string;
	title: string;
	author?: string | null;
	cover?: string | null;
	lastAccess: Date;
	hightlights?: Highlight[];
}

export interface Highlight {
	text: string;
	note?: string;
}

export class ProgressBar extends SingleBar {}
