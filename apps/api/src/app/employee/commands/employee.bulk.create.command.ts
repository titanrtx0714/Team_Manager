import { ICommand } from '@nestjs/cqrs';
import { IEmployeeCreateInput, LanguagesEnum } from '@gauzy/models';

export class EmployeeBulkCreateCommand implements ICommand {
	static readonly type = '[Employee] Register';

	constructor(
		public readonly input: IEmployeeCreateInput[],
		public readonly languageCode: LanguagesEnum
	) {}
}
