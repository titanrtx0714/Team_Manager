import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ExpenseCreateCommand } from '../expense.create.command';
import { Expense } from '../../expense.entity';
import { ExpenseService } from '../../expense.service';
import { EmployeeService } from '../../../employee/employee.service';
import { OrganizationService } from '../../../organization/organization.service';
import { EmployeeStatisticsService } from '../../../employee-statistics';
import { RequestContext } from '../../../core/context';

@CommandHandler(ExpenseCreateCommand)
export class ExpenseCreateHandler
	implements ICommandHandler<ExpenseCreateCommand> {
	constructor(
		private readonly expenseService: ExpenseService,
		private readonly employeeService: EmployeeService,
		private readonly organizationService: OrganizationService,
		private readonly employeeStatisticsService: EmployeeStatisticsService
	) {}

	public async execute(command: ExpenseCreateCommand): Promise<Expense> {
		const expense = await this.createExpense(command);
		let averageExpense = 0;
		if (expense && expense.employeeId) {
			const id = expense.employeeId;
			const stat = await this.employeeStatisticsService.getStatisticsByEmployeeId(
				expense.employeeId
			);
			averageExpense = this.expenseService.countStatistic(
				stat.expenseStatistics
			);
			await this.employeeService.create({
				id,
				averageExpenses: averageExpense
			});
		}
		return expense;
	}

	public async createExpense(
		command: ExpenseCreateCommand
	): Promise<Expense> {
		const { input } = command;
		const expense = new Expense();
		const employee = input.employeeId
			? await this.employeeService.findOneByIdString(input.employeeId)
			: null;
		const organization = await this.organizationService.findOneByIdString(
			input.organizationId
		);

		expense.amount = Math.abs(input.amount);
		expense.category = input.category;
		expense.vendor = input.vendor;
		expense.typeOfExpense = input.typeOfExpense;
		expense.organizationContact = input.organizationContact;
		expense.organizationContactId = input.organizationContactId;
		expense.project = input.project;
		expense.projectId = input.projectId;
		expense.notes = input.notes;
		expense.valueDate = input.valueDate;
		expense.employee = employee;
		expense.organization = organization;
		expense.currency = input.currency;
		expense.purpose = input.purpose;
		expense.taxType = input.taxType;
		expense.taxLabel = input.taxLabel;
		expense.rateValue = input.rateValue;
		expense.receipt = input.receipt;
		expense.splitExpense = input.splitExpense;
		expense.tags = input.tags;
		expense.status = input.status;
		expense.tenantId = RequestContext.currentTenantId();

		if (!expense.currency) {
			expense.currency = organization.currency;
		}
		return await this.expenseService.create(expense);
	}
}
