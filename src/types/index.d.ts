export interface Preferences {
	useChrome?: boolean;
	amazonRegion?: string;
	lastSelectedBooks?: string[];
}

export interface Configuration extends Preferences {
	email?: string;
	password?: string;
	keepSignIn?: boolean;
	selectedBooks?: string[];
	loadPreferences?: boolean;
	savePreferences?: boolean;
}

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
}

export interface Highlight {
	text: string;
	note?: string;
}
