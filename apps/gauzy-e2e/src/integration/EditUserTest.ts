import * as loginPage from '../support/Base/pages/Login.po';
import { LoginPageData } from '../support/Base/pagedata/LoginPageData';
import * as editUserPage from '../support/Base/pages/EditUser.po';
import * as addUserPage from '../support/Base/pages/AddUser.po';
import * as faker from 'faker';
import { EditUserPageData } from '../support/Base/pagedata/EditUserPageData';
import { AddUserPageData } from '../support/Base/pagedata/AddUserPageData';
import * as dashboradPage from '../support/Base/pages/Dashboard.po';
import { CustomCommands } from '../support/commands';

let firstName = ' ';
let lastName = ' ';
let username = ' ';
let password = ' ';
let email = ' ';
let imgUrl = ' ';
let editFirstName = ' ';
let editLastName = ' ';

describe('Edit user test', () => {
	before(() => {
		firstName = faker.name.firstName();
		lastName = faker.name.lastName();
		username = faker.internet.userName();
		email = faker.internet.email();
		password = faker.internet.password();
		imgUrl = faker.image.avatar();
		editFirstName = faker.name.firstName();
		editLastName = faker.name.lastName();

		CustomCommands.login(loginPage, LoginPageData, dashboradPage);
	});
	it('Should be able to add new user', () => {
		cy.visit('/#/pages/users');
		addUserPage.addUserButtonVisible();
		addUserPage.clickAddUserButton();
		addUserPage.firstNameInputVisible();
		addUserPage.enterFirstNameData(firstName);
		addUserPage.lastNameInputVisible();
		addUserPage.enterLastNameData(lastName);
		addUserPage.usernameInputVisible();
		addUserPage.enterUsernameData(username);
		addUserPage.emailInputVisible();
		addUserPage.enterEmailData(email);
		addUserPage.selectUserRoleVisible();
		addUserPage.selectUserRoleData(AddUserPageData.role);
		addUserPage.passwordInputVisible();
		addUserPage.enterPasswordInputData(password);
		addUserPage.imageInputVisible();
		addUserPage.enterImageDataUrl(imgUrl);
		addUserPage.confirmAddButtonVisible();
		addUserPage.clickConfirmAddButton();
		addUserPage.waitMessageToHide();
		addUserPage.verifyUserExists(`${firstName} ${lastName}`);
	});
	it('Should be able to edit user', () => {
		cy.on('uncaught:exception', (err, runnable) => {
			return false;
		});
		editUserPage.gridButtonVisible();
		editUserPage.clickGridButton();
		editUserPage.tableRowVisible();
		editUserPage.selectTableRow(`${firstName} ${lastName}`);
		editUserPage.editButtonVisible();
		editUserPage.clickEditButton();
		editUserPage.orgTabButtonVisible();
		editUserPage.clickOrgTabButton(1);
		editUserPage.addOrgButtonVisible();
		editUserPage.clickAddOrgButton();
		editUserPage.selectOrgDropdownVisible();
		editUserPage.clickSelectOrgDropdown();
		editUserPage.clickSelectOrgDropdownOption();
		editUserPage.saveSelectedOrgButtonVisible();
		editUserPage.clickSaveselectedOrgButton();
		editUserPage.removeOrgButtonVisible();
		editUserPage.clickRemoveOrgButton();
		editUserPage.confirmRemoveBtnVisible();
		editUserPage.clickConfirmRemoveButton();
		editUserPage.clickOrgTabButton(0);
		editUserPage.firstNameInputVisible();
		editUserPage.lastNameInputVisible();
		editUserPage.passwordInputVisible();
		editUserPage.repeatPasswordInputVisible();
		editUserPage.emailInputVisible();
		editUserPage.tagsMultyselectVisible();
		editUserPage.selectRoleVisible();
		editUserPage.languageSelectVisible();
		editUserPage.saveBtnExists();
		editUserPage.enterFirstNameData(editFirstName);
		editUserPage.enterLastNameData(editLastName);
		editUserPage.enterPasswordData(password);
		editUserPage.enterRepeatPasswordData(password);
		editUserPage.enterEmailData(email);
		editUserPage.clickKeyboardButtonByKeyCode(9);
		editUserPage.chooseRoleSelectData(EditUserPageData.role);
		editUserPage.chooseLanguage(EditUserPageData.preferredLanguage);
		editUserPage.saveBtnClick();
		addUserPage.waitMessageToHide();
		addUserPage.verifyUserExists(`${editFirstName} ${editLastName}`);
	});
});
