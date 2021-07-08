import { Component } from '@angular/core';
import { InvitationTypeEnum } from '@gauzy/contracts';

@Component({
	selector: 'ga-manage-user-invite',
	templateUrl: './manage-user-invite.component.html'
})
export class ManageUserInviteComponent {

	invitationTypeEnum = InvitationTypeEnum;

	constructor() {}
}
