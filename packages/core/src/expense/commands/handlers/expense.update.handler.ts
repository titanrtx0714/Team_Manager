import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ExpenseService } from '../../expense.service';
import { EmployeeService } from '../../../employee/employee.service';
import { EmployeeStatisticsService } from '../../../employee-statistics';
import { ExpenseUpdateCommand } from '../expense.update.command';
import { IExpense } from '@gauzy/contracts';

@CommandHandler(ExpenseUpdateCommand)
export class ExpenseUpdateHandler
	implements ICommandHandler<ExpenseUpdateCommand> {
	constructor(
		private readonly expenseService: ExpenseService,
		private readonly employeeService: EmployeeService,
		private readonly employeeStatisticsService: EmployeeStatisticsService
	) {}

	public async execute(command: ExpenseUpdateCommand): Promise<any> {
		let { id } = command;
		const { entity } = command;
		const expense = await this.updateExpense(id, entity);

		let averageExpense = 0;
		if (expense && expense.employeeId) {
			id = expense.employeeId;
			const statistic = await this.employeeStatisticsService.getStatisticsByEmployeeId(
				id
			);
			averageExpense = this.expenseService.countStatistic(
				statistic.expenseStatistics
			);
			await this.employeeService.create({
				id,
				averageExpenses: averageExpense
			});
		}
		return expense;
	}

	public async updateExpense(
		expenseId: string,
		entity: IExpense
	): Promise<IExpense> {
		const id = expenseId;
		return await this.expenseService.create({
			id,
			...entity
		});
	}
}
