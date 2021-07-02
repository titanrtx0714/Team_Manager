import * as loginPage from '../../Base/pages/Login.po';
import { LoginPageData } from '../../Base/pagedata/LoginPageData';
import * as customersPage from '../../Base/pages/Customers.po';
import * as faker from 'faker';
import { CustomersPageData } from '../../Base/pagedata/CustomersPageData';
import * as dashboardPage from '../../Base/pages/Dashboard.po';
import * as organizationProjectsPage from '../../Base/pages/OrganizationProjects.po';
import { OrganizationProjectsPageData } from '../../Base/pagedata/OrganizationProjectsPageData';
import * as organizationTagsUserPage from '../../Base/pages/OrganizationTags.po';
import { OrganizationTagsPageData } from '../../Base/pagedata/OrganizationTagsPageData';
import { CustomCommands } from '../../commands';
import * as manageEmployeesPage from '../../Base/pages/ManageEmployees.po';

import { Given, Then, When, And } from 'cypress-cucumber-preprocessor/steps';

let email = faker.internet.email();
let fullName = faker.name.firstName() + ' ' + faker.name.lastName();
let deleteName = faker.name.firstName() + ' ' + faker.name.lastName();
let city = faker.address.city();
let postcode = faker.address.zipCode();
let street = faker.address.streetAddress();
let website = faker.internet.url();

let firstName = faker.name.firstName();
let lastName = faker.name.lastName();
let username = faker.internet.userName();
let password = faker.internet.password();
let employeeEmail = faker.internet.email();
let imgUrl = faker.image.avatar();

// Login with email
Given('Login with default credentials', () => {
	CustomCommands.login(loginPage, LoginPageData, dashboardPage);
});

// Add new tag
Then('User can add new tag', () => {
	CustomCommands.addTag(organizationTagsUserPage, OrganizationTagsPageData);
});

// Add employee
And('User can add new employee', () => {
	CustomCommands.login(loginPage, LoginPageData, dashboardPage);
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
	CustomCommands.login(loginPage, LoginPageData, dashboardPage);
	CustomCommands.addProject(
		organizationProjectsPage,
		OrganizationProjectsPageData
	);
});

// Add new customer
And('User can visit Contacts customers page', () => {
	CustomCommands.login(loginPage, LoginPageData, dashboardPage);
	cy.visit('/#/pages/contacts/customers');
});

Then('User can see grid button', () => {
	customersPage.gridBtnExists();
});

And('User can see grid second grid button to change view', () => {
	customersPage.gridBtnClick(1);
});

And('User can see Add button', () => {
	customersPage.addButtonVisible();
});

When('User click Add button', () => {
	customersPage.clickAddButton();
});

Then('User can see name input field', () => {
	customersPage.nameInputVisible();
});

And('User can enter new value for name', () => {
	customersPage.enterNameInputData(fullName);
});

And('User can see email input field', () => {
	customersPage.emailInputVisible();
});

And('User can enter new value for email', () => {
	customersPage.enterEmailInputData(email);
});

And('User can see phone input field', () => {
	customersPage.phoneInputVisible();
});

And('User can enter new value for phone', () => {
	customersPage.enterPhoneInputData(CustomersPageData.defaultPhone);
});

And('User can see project dropdown', () => {
	customersPage.projectDropdownVisible();
});

When('User click on project dropdown', () => {
	customersPage.clickProjectDropdown();
});

Then('User can select project from dropdown options', () => {
	customersPage.selectProjectFromDropdown(CustomersPageData.defaultProject);
});

And('User can see tags multyselect', () => {
	customersPage.tagsMultyselectVisible();
});

When('User click on tags nultyselect', () => {
	customersPage.clickTagsMultyselect();
});

Then('User can select tags from dropdown options', () => {
	customersPage.selectTagsFromDropdown(0);
	customersPage.clickCardBody();
});

And('User can see website input field', () => {
	customersPage.websiteInputVisible();
});

And('User can enter value for website', () => {
	customersPage.enterWebsiteInputData(website);
});

And('User can see save button', () => {
	customersPage.saveButtonVisible();
});

When('User click on save button', () => {
	customersPage.clickSaveButton();
});

Then('User can see country dropdown', () => {
	customersPage.countryDropdownVisible();
});

When('User click on country dropdown', () => {
	customersPage.clickCountryDropdown();
});

Then('User can select country from dropdown options', () => {
	customersPage.selectCountryFromDropdown(CustomersPageData.country);
});

And('User can see city input field', () => {
	customersPage.cityInputVisible();
});

And('User can enter value for city', () => {
	customersPage.enterCityInputData(city);
});

And('User can see post code input field', () => {
	customersPage.postcodeInputVisible();
});

And('User can enter value for postcode', () => {
	customersPage.enterPostcodeInputData(postcode);
});

And('User can see street input field', () => {
	customersPage.streetInputVisible();
});

And('User can enter value for street', () => {
	customersPage.enterStreetInputData(street);
});

And('User can see next button', () => {
	customersPage.verifyNextButtonVisible();
});

When('User click on next button', () => {
	customersPage.clickNextButton();
});

And('User can see employee dropdown', () => {
	customersPage.selectEmployeeDropdownVisible();
});

When('User click on employee dropdown', () => {
	customersPage.clickSelectEmployeeDropdown();
});

Then('User can select employee from dropdown options', () => {
	customersPage.selectEmployeeDropdownOption(0);
	customersPage.clickKeyboardButtonByKeyCode(9);
});

Then('User can see finish button', () => {
	customersPage.verifyFinishButtonVisible();
});

When('User click on finish button', () => {
	customersPage.clickFinishButton();
});

Then('Notification message will appear', () => {
	customersPage.waitMessageToHide();
});

And('User can verify customer was edited', () => {
	customersPage.verifyCustomerExists(fullName);
});

// Invite customer
And('User can see invite button', () => {
	customersPage.inviteButtonVisible();
});

When('User click on invite button', () => {
	customersPage.clickInviteButton();
});

Then('User can see customer name input field', () => {
	customersPage.customerNameInputVisible();
});

And('User can enter value for customer name', () => {
	customersPage.enterCustomerNameData(fullName);
});

And('User can see customer phone input field', () => {
	customersPage.customerPhoneInputVisible();
});

And('User can enter value for customer phone', () => {
	customersPage.enterCustomerPhoneData(CustomersPageData.defaultPhone);
});

And('User can see customer email input field', () => {
	customersPage.customerEmailInputVisible();
});

And('User can enter value for customer email', () => {
	customersPage.enterCustomerEmailData(email);
});

And('User can see save invite button', () => {
	customersPage.saveInvitebuttonVisible();
});

When('User click on save invite button', () => {
	customersPage.clickSaveInviteButton();
});

Then('Notification message will appear', () => {
	customersPage.waitMessageToHide();
});

And('User can verify customer was created', () => {
	customersPage.verifyCustomerExists(fullName);
});

// Edit customer
And('User can see customers table', () => {
	customersPage.tableRowVisible();
});

When('User select first table row', () => {
	customersPage.selectTableRow(0);
});

Then('Edit button will become active', () => {
	customersPage.editButtonVisible();
});

When('User click on edit button', () => {
	customersPage.clickEditButton();
});

Then('User can see name input field', () => {
	customersPage.nameInputVisible();
});

And('User can enter new value for name', () => {
	customersPage.enterNameInputData(deleteName);
});

And('User can see email input field', () => {
	customersPage.emailInputVisible();
});

And('User can enter new value for email', () => {
	customersPage.enterEmailInputData(email);
});

And('User can see phone input field', () => {
	customersPage.phoneInputVisible();
});

And('User can enter new value for phone', () => {
	customersPage.enterPhoneInputData(CustomersPageData.defaultPhone);
});

And('User can see website input field', () => {
	customersPage.websiteInputVisible();
});

And('User can enter value for website', () => {
	customersPage.enterWebsiteInputData(website);
});

And('User can see save button', () => {
	customersPage.saveButtonVisible();
});

When('User click on save button', () => {
	customersPage.clickSaveButton();
});

Then('User can see country dropdown', () => {
	customersPage.countryDropdownVisible();
});

When('User click on country dropdown', () => {
	customersPage.clickCountryDropdown();
});

Then('User can select country from dropdown options', () => {
	customersPage.selectCountryFromDropdown(CustomersPageData.country);
});

And('User can see city input field', () => {
	customersPage.cityInputVisible();
});

And('User can enter value for city', () => {
	customersPage.enterCityInputData(city);
});

And('User can see post code input field', () => {
	customersPage.postcodeInputVisible();
});

And('User can enter value for postcode', () => {
	customersPage.enterPostcodeInputData(postcode);
});

And('User can see street input field', () => {
	customersPage.streetInputVisible();
});

And('User can enter value for street', () => {
	customersPage.enterStreetInputData(street);
});

And('User can see next button', () => {
	customersPage.verifyNextButtonVisible();
});

When('User click on next button', () => {
	customersPage.clickNextButton();
});

Then('User can see finish button', () => {
	customersPage.verifyFinishButtonVisible();
});

When('User click on finish button', () => {
	customersPage.clickFinishButton();
});

Then('Notification message will appear', () => {
	customersPage.waitMessageToHide();
});

And('User can verify customer was edited', () => {
	customersPage.verifyCustomerExists(deleteName);
});

// Delete customer
Then('User can see contacts table', () => {
	customersPage.tableRowVisible();
});

When('User select first table row', () => {
	customersPage.selectTableRow(0);
});

Then('Delete button will become active', () => {
	customersPage.deleteButtonVisible();
});

When('User click on delete button', () => {
	customersPage.clickDeleteButton();
});

Then('User can see confirm delete button', () => {
	customersPage.confirmDeleteButtonVisible();
});

When('User click on confirm delete button', () => {
	customersPage.clickConfirmDeleteButton();
});

Then('Notification message will appear', () => {
	customersPage.waitMessageToHide();
});

And('User can verify customer was deleted', () => {
	customersPage.verifyElementIsDeleted(deleteName);
});
