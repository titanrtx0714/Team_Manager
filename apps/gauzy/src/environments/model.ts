export interface Environment {
	production: boolean;

	API_BASE_URL: string;
	CLIENT_BASE_URL: string;

	PLATFORM_WEBSITE_URL?: string;
	PLATFORM_WEBSITE_DOWNLOAD_URL?: string;
	DESKTOP_APP_DOWNLOAD_LINK_APPLE?: string;
	DESKTOP_APP_DOWNLOAD_LINK_WINDOWS?: string;
	DESKTOP_APP_DOWNLOAD_LINK_LINUX?: string;
	MOBILE_APP_DOWNLOAD_LINK?: string;
	EXTENSION_DOWNLOAD_LINK?: string;

	COMPANY_NAME: string;
	COMPANY_SITE: string;
	COMPANY_LINK: string;
	COMPANY_SITE_LINK: string;
	COMPANY_GITHUB_LINK: string;
	COMPANY_GITLAB_LINK: string;
	COMPANY_FACEBOOK_LINK: string;
	COMPANY_TWITTER_LINK: string;
	COMPANY_LINKEDIN_LINK: string;

	CLOUDINARY_CLOUD_NAME?: string;
	CLOUDINARY_API_KEY?: string;

	GOOGLE_AUTH_LINK: string;
	FACEBOOK_AUTH_LINK: string;
	LINKEDIN_AUTH_LINK: string;
	GITHUB_AUTH_LINK: string;
	TWITTER_AUTH_LINK: string;
	MICROSOFT_AUTH_LINK: string;
	AUTH0_AUTH_LINK: string;

	NO_INTERNET_LOGO: string;

	SENTRY_DSN?: string;
	SENTRY_TRACES_SAMPLE_RATE?: string;

	HUBSTAFF_REDIRECT_URL?: string;

	IS_ELECTRON: boolean;

	GOOGLE_MAPS_API_KEY: string;
	GOOGLE_PLACE_AUTOCOMPLETE: boolean;

	DEFAULT_LATITUDE: number;
	DEFAULT_LONGITUDE: number;
	DEFAULT_CURRENCY: string;
	DEFAULT_COUNTRY?: string;

	IS_INTEGRATED_DESKTOP: boolean;

	DEMO: boolean;

	DEMO_SUPER_ADMIN_EMAIL?: string;
	DEMO_SUPER_ADMIN_PASSWORD?: string;

	DEMO_ADMIN_EMAIL?: string;
	DEMO_ADMIN_PASSWORD?: string;

	DEMO_EMPLOYEE_EMAIL?: string;
	DEMO_EMPLOYEE_PASSWORD?: string;

	CHATWOOT_SDK_TOKEN: string;
	CHAT_MESSAGE_GOOGLE_MAP: string;

	GAUZY_CLOUD_APP: string;

	FILE_PROVIDER: string;

	JITSU_BROWSER_HOST?: string;
	JITSU_BROWSER_WRITE_KEY?: string;

	JITSU_SERVER_HOST?: string;
	JITSU_SERVER_WRITE_KEY?: string;

	/** Github Integration */
	GAUZY_GITHUB_APP_NAME: string;
	GAUZY_GITHUB_APP_ID: string;
	GAUZY_GITHUB_CLIENT_ID: string;
	GAUZY_GITHUB_REDIRECT_URL: string;
}
