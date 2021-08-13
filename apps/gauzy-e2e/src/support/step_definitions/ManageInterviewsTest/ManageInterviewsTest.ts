import * as loginPage from '../../Base/pages/Login.po';
import { LoginPageData } from '../../Base/pagedata/LoginPageData';
import { ManageInterviewsPageData } from '../../Base/pagedata/ManageInterviewsPageData';
import * as manageInterviewsPage from '../../Base/pages/ManageInterviews.po';
import { CustomCommands } from '../../commands';
import * as dashboardPage from '../../Base/pages/Dashboard.po';
import * as inviteCandidatePage from '../../Base/pages/Candidates.po';
import * as faker from 'faker';
import * as logoutPage from '../../Base/pages/Logout.po';
import * as manageEmployeesPage from '../../Base/pages/ManageEmployees.po';

import { Given, Then, When, And } from 'cypress-cucumber-preprocessor/steps';

const pageLoadTimeout = Cypress.config('pageLoadTimeout');

let email = faker.internet.email();
let firstName = faker.name.firstName();
let lastName = faker.name.lastName();
let username = faker.internet.userName();
let password = faker.internet.password();
let imgUrl = faker.image.avatar();

let empFirstName = faker.name.firstName();
let empLastName = faker.name.lastName();
let empUsername = faker.internet.userName();
let empPassword = faker.internet.password();
let employeeEmail = faker.internet.email();
let empImgUrl = faker.image.avatar();

const randomInterviewTitleNumber =
	ManageInterviewsPageData.title + Math.floor(Math.random() * 1000) + 1;

// Login with email
Given('Login with default credentials', () => {
	CustomCommands.login(loginPage, LoginPageData, dashboardPage);
});

// Add new employee
And('User can add new employee', () => {
	CustomCommands.addEmployee(
		manageEmployeesPage,
		empFirstName,
		empLastName,
		empUsername,
		employeeEmail,
		empPassword,
		empImgUrl
	);
});

// Add candidate
And('User can add new candidate', () => {
	CustomCommands.logout(dashboardPage, logoutPage, loginPage);
	CustomCommands.clearCookies();
	CustomCommands.login(loginPage, LoginPageData, dashboardPage);
	CustomCommands.addCandidate(
		inviteCandidatePage,
		firstName,
		lastName,
		username,
		email,
		password,
		imgUrl
	);
});

// Add interview
And('User can visit Candidates interviews calendar page', () => {
	CustomCommands.logout(dashboardPage, logoutPage, loginPage);
	CustomCommands.clearCookies();
	CustomCommands.login(loginPage, LoginPageData, dashboardPage);
	cy.visit('/#/pages/employees/candidates/interviews/calendar', {
		timeout: pageLoadTimeout
	});
});

And('User can see add interview button', () => {
	manageInterviewsPage.addInterviewButtonVisible();
});

When('User click on add interview button', () => {
	manageInterviewsPage.clickAddInterviewButton();
});

Then('User can see candidate dropdown', () => {
	manageInterviewsPage.candidateDropdownVisible();
});

When('User click on candidate dropdown', () => {
	manageInterviewsPage.clickCandidateDropdown();
});

Then('User can select candidate from dropdown options', () => {
	manageInterviewsPage.candidateDropdownOptionVisible();
	manageInterviewsPage.selectCandidateFromDropdown(
		`${firstName} ${lastName}`
	);
});

And('User can see title input field', () => {
	manageInterviewsPage.titleInputVisible();
});

And('User can enter value for title', () => {
	manageInterviewsPage.enterTitleInputData(randomInterviewTitleNumber);
});

And('User can see date input field', () => {
	manageInterviewsPage.dateInputVisible();
});

And('User can enter value for date', () => {
	manageInterviewsPage.enterDateInputData();
	manageInterviewsPage.clickKeyboardButtonByKeyCode(9);
});

And('User can see employee dropdown', () => {
	manageInterviewsPage.employeeDropdownVisible();
});

When('User click on employee dropdown', () => {
	manageInterviewsPage.clickEmployeeDropdown();
});

Then('User can select employee from dropdown options', () => {
	manageInterviewsPage.employeeDropdownOptionVisible();
	manageInterviewsPage.clickEmployeeDropdownOption(0);
	manageInterviewsPage.clickKeyboardButtonByKeyCode(9);
});

And('User can see interview type button', () => {
	manageInterviewsPage.interviewTypeButtonVisible();
});

When('User click on interview type button', () => {
	manageInterviewsPage.clickInterviewTypeButton(1);
});

Then('User can see location input field', () => {
	manageInterviewsPage.locationinputVisible();
});

And('User can enter value for location', () => {
	manageInterviewsPage.enterLocationInputData(
		ManageInterviewsPageData.location
	);
});

And('User can see note input field', () => {
	manageInterviewsPage.noteInputVisible();
});

And('User can enter value for note', () => {
	manageInterviewsPage.enterNoteInputData(ManageInterviewsPageData.note);
});

And('User can see next button', () => {
	manageInterviewsPage.nextButtonVisible();
});

When('User click on next button', () => {
	manageInterviewsPage.clickNextButton();
});

Then('User will see next step button', () => {
	manageInterviewsPage.nextStepButtonVisible();
});

When('User click on next step button', () => {
	manageInterviewsPage.clickNextStepButton();
});

Then('User will notify candidate button', () => {
	manageInterviewsPage.notifyCandidateCheckboxVisible();
});

When('User can click on notify candidate button', () => {
	manageInterviewsPage.clickNotifyCandidateCheckbox(0);
});

Then('User can see save button', () => {
	manageInterviewsPage.scrollElement();
	manageInterviewsPage.saveButtonVisible();
});

When('User click on save button', () => {
	manageInterviewsPage.clickSaveButton();
});

Then('Notification message will appear', () => {
	manageInterviewsPage.waitMessageToHide();
});

// Add interview feedback
And('User navigates to Candidates interview panel', () => {
	CustomCommands.logout(dashboardPage, logoutPage, loginPage);
	CustomCommands.clearCookies();
	CustomCommands.login(loginPage, LoginPageData, dashboardPage);
	cy.visit('/#/pages/employees/candidates/interviews/interview_panel');
	// manageInterviewsPage.verifySheduleExist(`${firstName} ${lastName}`);
});

And('User can see filter name input field', () => {
	manageInterviewsPage.nameFilterInputVisible();
});

When('User enter filter input value', () => {
	manageInterviewsPage.enterFilterInputData(`${firstName} ${lastName}`);
});

Then('User can see filtered candidate', () => {
	manageInterviewsPage.filteredCandidateVisible(`${firstName} ${lastName}`);
});

And('User can see Add Feedback button', () => {
	manageInterviewsPage.verifyAddFeedbackButtonVisisible();
});

When('User clicks on Add Feedback button', () => {
	manageInterviewsPage.clickAddFeedbackButton();
});

Then('User can see Add Interview dropdown', () => {
	manageInterviewsPage.interviewDropdownVisible();
});

When('User clicks on Add Interviewer dropdown', () => {
	manageInterviewsPage.clickInterviewerDropdown();
});

Then('User can select Interviewer from dropdown options', () => {
	manageInterviewsPage.clickInterviewerFromDropdown(0);
	manageInterviewsPage.clickKeyboardButtonByKeyCode(9);
});

And('User can see Rating input', () => {
	manageInterviewsPage.verifyRating();
});

And('User clicks on Rating input', () => {
	manageInterviewsPage.clickRating();
});

And('User can see Radio group', () => {
	manageInterviewsPage.verifyHireRejectRadioGroup();
});

And('User clicks on a Radio option', () => {
	manageInterviewsPage.clickRadioOption();
});

And('User can see Feedback description input field', () => {
	manageInterviewsPage.verifyFeedbackDescription();
});

And('User enters value for Feedback description', () => {
	manageInterviewsPage.enterFeedBackDescription(
		ManageInterviewsPageData.feedbackDescription
	);
});

And('User can see feedback save button', () => {
	manageInterviewsPage.feedbackSaveButtonVisible();
});

When('User clicks on save button', () => {
	manageInterviewsPage.clickFeedbackSaveButton();
});

Then('Notification message will appear', () => {
	manageInterviewsPage.waitMessageToHide();
});

And('User clears filter input', () => {
	manageInterviewsPage.clearFilterInputField();
});
