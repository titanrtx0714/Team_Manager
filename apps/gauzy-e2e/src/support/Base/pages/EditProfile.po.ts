import {
	enterInput,
	verifyElementIsVisible,
	clickButton,
	clickElementByText,
	clearField
} from '../utils/util';
import { EditProfilePage } from '../pageobjects/EditProfilePageObject';

export const firstNameInputVisible = () => {
	verifyElementIsVisible(EditProfilePage.firstNameInputCss);
};

export const enterFirstNameData = (data) => {
	clearField(EditProfilePage.firstNameInputCss);
	enterInput(EditProfilePage.firstNameInputCss, data);
};

export const lastNameInputVisible = () => {
	verifyElementIsVisible(EditProfilePage.lastNameInputCss);
};

export const enterLastNameData = (data) => {
	clearField(EditProfilePage.lastNameInputCss);
	enterInput(EditProfilePage.lastNameInputCss, data);
};

export const languageSelectVisible = () => {
	verifyElementIsVisible(EditProfilePage.preferredLanguageCss);
};

export const chooseLanguage = (data) => {
	clickButton(EditProfilePage.preferredLanguageCss);
	clickElementByText(EditProfilePage.preferredLanguageOptionCss, data);
};

export const saveBtnExists = () => {
	verifyElementIsVisible(EditProfilePage.saveButtonCss);
};

export const saveBtnClick = () => {
	clickButton(EditProfilePage.saveButtonCss);
};
