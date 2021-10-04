export interface Preferences {
	useChrome?: boolean;
	amazonRegion?: string;
	lastSelectedBooks?: string[];
	grabSentence?: boolean;
}

export interface Answer extends Preferences {
	username?: string;
	password?: string;
	selectedBooks?: string[];
	loadPreferences?: boolean;
	savePreferences?: boolean;
}
