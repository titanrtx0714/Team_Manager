import { Column, Entity, ManyToMany, JoinTable, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IExpense, IExpenseCategory, ITag } from '@gauzy/contracts';
import { Expense, Tag, TenantOrganizationBaseEntity } from '../core/entities/internal';

@Entity('expense_category')
export class ExpenseCategory
	extends TenantOrganizationBaseEntity
	implements IExpenseCategory {
	
	@ApiProperty({ type: () => String })
	@IsString()
	@IsNotEmpty()
	@Column()
	name: string;

	/*
    |--------------------------------------------------------------------------
    | @ManyToMany 
    |--------------------------------------------------------------------------
    */

	/**
	 * Expense
	 */
	@ApiPropertyOptional({ type: () => Expense, isArray: true })
	@OneToMany(() => Expense, (expense) => expense.category)
	@JoinColumn()
	expenses?: IExpense[];

	/*
    |--------------------------------------------------------------------------
    | @ManyToMany 
    |--------------------------------------------------------------------------
    */
	@ApiPropertyOptional({ type: () => Tag, isArray: true })
	@ManyToMany(() => Tag, (tag) => tag.expenseCategory)
	@JoinTable({
		name: 'tag_organization_expense_category'
	})
	tags?: ITag[];
}
