import { CustomCommands } from '../../commands';
import { LoginPageData } from '../../Base/pagedata/LoginPageData';
import { AddOrganizationPageData } from '../../Base/pagedata/AddOrganizationPageData';
import { ClientsData } from '../../Base/pagedata/ClientsPageData';
import { OrganizationPublicPagePageData as OrganizationPublicPageData } from '../../Base/pagedata/OrganizationPublicPagePageData';
import * as logoutPage from '../../Base/pages/Logout.po';
import * as loginPage from '../../Base/pages/Login.po';
import * as organizationProjectsPage from '../../Base/pages/OrganizationProjects.po';
import * as clientsPage from '../../Base/pages/Clients.po';
import * as dashboardPage from '../../Base/pages/Dashboard.po';
import * as addOrganizationPage from '../../Base/pages/AddOrganization.po';
import * as manageEmployeesPage from '../../Base/pages/ManageEmployees.po';
import * as organizationPublicPage from '../../Base/pages/OrganizationPublicPage.po';

const pageLoadTimeout = Cypress.config('pageLoadTimeout');

import { Given, Then, When, And } from 'cypress-cucumber-preprocessor/steps';

import * as faker from 'faker';
import { OrganizationProjectsPageData } from '../../Base/pagedata/OrganizationProjectsPageData';

const email = faker.internet.email();
const fullName = faker.name.firstName() + ' ' + faker.name.lastName();
const city = faker.address.city();
const postcode = faker.address.zipCode();
const street = faker.address.streetAddress();
const website = faker.internet.url();

const firstName = faker.name.firstName();
const lastName = faker.name.lastName();
const username = faker.internet.userName();
const password = faker.internet.password();
const employeeEmail = faker.internet.email();
const imgUrl = faker.image.avatar();
const employeeFullName = `${firstName} ${lastName}`;

const organizationName = faker.company.companyName();
const taxId = faker.random.alphaNumeric();
const organizationStreet = faker.address.streetAddress();

// Login with email
Given('Login with default credentials', () => {
	CustomCommands.login(loginPage, LoginPageData, dashboardPage);
});

// Add new organization
And('User can add new organization', () => {
	CustomCommands.addOrganization(
		addOrganizationPage,
		organizationName,
		AddOrganizationPageData,
		taxId,
		organizationStreet
	);
});

const logoutLogin = () => {
	CustomCommands.logout(dashboardPage, logoutPage, loginPage);
	CustomCommands.clearCookies();
	CustomCommands.login(loginPage, LoginPageData, dashboardPage);
};

const selectOrganization = (name: string) => {
	organizationPublicPage.organizationDropdownVisible();
	organizationPublicPage.clickOrganizationDropdown();
	organizationPublicPage.selectOrganization(name);
};

// Add employee
And('User can add new employee', () => {
	logoutLogin();

	selectOrganization(organizationName);

	CustomCommands.addEmployee(
		manageEmployeesPage,
		firstName,
		lastName,
		username,
		employeeEmail,
		password,
		imgUrl
	);
});

// Add project
And('User can add new project', () => {
	logoutLogin();

	selectOrganization(organizationName);

	CustomCommands.addProject(
		organizationProjectsPage,
		OrganizationProjectsPageData
	);
});

// Add new client
And('User can add new client', () => {
	logoutLogin();

	selectOrganization(organizationName);

	CustomCommands.addClient(
		clientsPage,
		fullName,
		email,
		website,
		city,
		postcode,
		street,
		ClientsData,
		employeeFullName
	);
});

// Add new public profile link
And('User can navigate to organizations page', () => {
	logoutLogin();
	cy.visit('/#/pages/organizations', { timeout: pageLoadTimeout });
});

And('User can see organization name filter input field', () => {
	organizationPublicPage.organizationNameFilterInputVisible();
});

When('User enters organization name filter input value', () => {
	organizationPublicPage.enterOrganizationNameFilterInputData(
		organizationName
	);
});

Then('User can see filtered organization', () => {
	organizationPublicPage.verifyOrganizationNameTableRowContains(
		`${organizationName}`
	);
});

When('User selects organization from table row', () => {
	organizationPublicPage.selectOrganizationTableRow();
});

Then('Manage button will become active', () => {
	organizationPublicPage.manageBtnExists();
});

When('User clicks on manage button', () => {
	organizationPublicPage.manageBtnClick();
});

Then('User can see profile link input field', () => {
	organizationPublicPage.profileLinkInputVisible();
});

And('User enters profile link value', () => {
	organizationPublicPage.enterProfileLinkInputData(organizationName);
});

Then('User can see save button', () => {
	organizationPublicPage.saveButtonVisible();
});

When('User clicks on save button', () => {
	organizationPublicPage.clickSaveButton();
});

Then('Notification message will appear', () => {
	organizationPublicPage.waitMessageToHide();
});

// Edit public page
And('User can navigate to organization public page', () => {
	logoutLogin();

	cy.visit(`/#/share/organization/${organizationName}`);
});

And('User can see Edit Page button', () => {
	organizationPublicPage.editPageButtonVisible();
});

When('User clicks on Edit Page button', () => {
	organizationPublicPage.clickEditPageButton();
});

Then('User can see company name input field', () => {
	organizationPublicPage.companyNameInputVisible();
});

And('User enters company name value', () => {
	organizationPublicPage.enterCompanyNameInputData(
		OrganizationPublicPageData.copyrightSymbol
	);
});

And('User can see company size input field', () => {
	organizationPublicPage.companySizeInputVisible();
});

And('User enters company size value', () => {
	organizationPublicPage.enterCompanySizeInputData(
		OrganizationPublicPageData.companySize
	);
});

And('User can see year founded input field', () => {
	organizationPublicPage.yearFoundedInputVisible();
});

And('User enters year founded value', () => {
	organizationPublicPage.enterYearFoundedInputData(
		OrganizationPublicPageData.yearFounded
	);
});

And('User can see banner input field', () => {
	organizationPublicPage.bannerInputVisible();
});

And('User enters banner value', () => {
	organizationPublicPage.enterBannerInputData(
		OrganizationPublicPageData.banner
	);
});

And('User see minimum project size dropdown', () => {
	organizationPublicPage.minimumProjectSizeDropdownVisible();
});

When('User clicks on minimum project size dropdown', () => {
	organizationPublicPage.clickMinimumProjectSizeDropdown();
});

Then('User can select minimum project size from dropdown options', () => {
	organizationPublicPage.selectMinimumProjectSizeDropdownOption(
		OrganizationPublicPageData.minimumProjectSizeUSD
	);
});

And('User can see client focus dropdown', () => {
	organizationPublicPage.clientFocusDropdownVisible();
});

When('User clicks on client focus dropdown', () => {
	organizationPublicPage.clickClientFocusDropdown();
});

Then('User can select client focus from dropdown options', () => {
	organizationPublicPage.selectClientFocusDropdownOptions(
		OrganizationPublicPageData.clientFocus
	);
});

And('User can see short description input field', () => {
	organizationPublicPage.shortDescriptionVisible();
});

And('User enters short description value', () => {
	organizationPublicPage.enterShortDescriptionInputData(
		OrganizationPublicPageData.shortDescription
	);
});

And('User can see awards tab', () => {
	organizationPublicPage.awardsTabVisible();
});

When('User clicks on awards tab', () => {
	organizationPublicPage.clickAwardsTab();
});

Then('Use can see add award button', () => {
	organizationPublicPage.addAwardsButtonVisible();
});

When('User clicks on award button', () => {
	organizationPublicPage.clickAwardButton();
});

Then('User can see award name input field', () => {
	organizationPublicPage.awardNameInputVisible();
});

And('User enters award name value', () => {
	organizationPublicPage.enterAwardNameInputData(
		OrganizationPublicPageData.awardName
	);
});

And('User can see award year input field', () => {
	organizationPublicPage.awardYearInputVisible();
});

And('User enters award year value', () => {
	organizationPublicPage.enterAwardYearInputData(
		OrganizationPublicPageData.awardYear
	);
});

And('User can see save award button', () => {
	organizationPublicPage.awardsSaveButtonVisible();
});

When('User clicks on save award button', () => {
	organizationPublicPage.clickAwardsSaveButton();
});

Then('Notification message will appear', () => {
	organizationPublicPage.waitMessageToHide();
});

And('User can see skills tab', () => {
	organizationPublicPage.skillsTabVisible();
});

When('User clicks on skills tab', () => {
	organizationPublicPage.clickSkillsTab();
});

Then('User can see skills dropdown', () => {
	organizationPublicPage.skillsDropdownVisible();
});

When('User clicks on skills dropdown', () => {
	organizationPublicPage.clickSkillsDropdown();
});

Then('User can select skills from dropdown options', () => {
	organizationPublicPage.selectSkillsFromDropdownOptions(
		OrganizationPublicPageData.skills
	);
});

And('User can see languages tab', () => {
	organizationPublicPage.languagesTabVisible();
});

When('User clicks on languages tab', () => {
	organizationPublicPage.clickLanguagesTab();
});

Then('User can see add language button', () => {
	organizationPublicPage.addLanguageButtonVisible();
});

When('User clicks on add language button', () => {
	organizationPublicPage.clickAddLanguageButton();
});

Then('User can see language dropdown', () => {
	organizationPublicPage.languageDropdownVisible();
});

When('User clicks on language dropdown', () => {
	organizationPublicPage.clickLanguageDropdown();
});

Then('User can select language from dropdown options', () => {
	organizationPublicPage.selectLanguageFromDropdownOptions(
		OrganizationPublicPageData.language
	);
});

And('User can see language level dropdown', () => {
	organizationPublicPage.languageLevelDropdownVisible();
});

When('User clicks on language level dropdown', () => {
	organizationPublicPage.clickLanguageLevelDropdown();
});

Then('User can select language level from dropdown options', () => {
	organizationPublicPage.selectLanguageLevelFromDropdownOptions(
		OrganizationPublicPageData.languageLevel
	);
});

And('User can see save language button', () => {
	organizationPublicPage.languagesSaveButtonVisible();
});

When('User clicks on save language button', () => {
	organizationPublicPage.clickLanguagesSaveButton();
});

Then('Notification message will appear', () => {
	organizationPublicPage.waitMessageToHide();
});

And('User can see Update button', () => {
	organizationPublicPage.updateButtonVisible();
});

When('User clicks on Update button', () => {
	organizationPublicPage.clickUpdateButton();
});

Then('Notification message will appear', () => {
	organizationPublicPage.waitMessageToHide();
});

// Verify public page data
And('User can verify company name', () => {
	organizationPublicPage.verifyCompanyName(
		OrganizationPublicPageData.copyrightSymbol
	);
});

And('User can verify banner', () => {
	organizationPublicPage.verifyBanner(OrganizationPublicPageData.banner);
});

And('User can verify company size', () => {
	organizationPublicPage.verifyCompanySize(
		OrganizationPublicPageData.companySizeStr
	);
});

And('User can verify total clients', () => {
	organizationPublicPage.verifyTotalClients(
		OrganizationPublicPageData.totalClients
	);
});

And('User can verify client focus', () => {
	organizationPublicPage.verifyClientFocus(
		OrganizationPublicPageData.clientFocus
	);
});
