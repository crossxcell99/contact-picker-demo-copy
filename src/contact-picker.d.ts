// https://developer.mozilla.org/en-US/docs/Web/API/ContactsManager

type ContactAddress = Record<string, unknown>;

interface ContactProperties {
	/**
	 * The contact's name.
	 * An array strings, each a unique name of an individual.
	 */
	name: string[];
	/**
	 * The telephone number(s) of the contact.
	 * An array strings, each a unique phone number of an individual.
	 */
	tel: string[];
	/**
	 * The email address of the contact.
	 * An array of strings containing email addresses.
	 */
	email: string[];
	/**
	 * The contact's postal address.
	 * An Array of ContactAddress objects, each containing specifics of a unique physical address.
	 */
	address: ContactAddress[];
	/**
	 * The avatar of the contact.
	 * An array of Blob objects containing images of an individual
	 * */
	icon: Blob[];
}

type ContactsPropertiesKeys = keyof ContactProperties;

interface ContactsManagerSelectOptions {
	/** A Boolean that allows multiple contacts to be selected. The default is false.*/
	multiple: boolean;
}

interface ContactsManager {
	select(properties: ContactsPropertiesKeys[]): Promise<ContactProperties[]>;
	select(
		properties: ContactsPropertiesKeys[],
		options: ContactsManagerSelectOptions
	): Promise<ContactProperties[]>;
	getProperties(): Promise<ContactsPropertiesKeys[]>;
}

declare interface NavigatorCM {
	readonly contacts: ContactsManager;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
declare interface Navigator extends NavigatorCM {}
