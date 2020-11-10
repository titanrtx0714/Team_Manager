import { Connection } from 'typeorm';
import { Report } from './report.entity';
import { ReportCategory } from './report-category.entity';
import { indexBy } from 'underscore';
import { join } from 'path';
import { copyFileSync, mkdirSync } from 'fs';

export const createDefaultReport = async (
	connection: Connection
): Promise<Report[]> => {
	const defaultCategories: ReportCategory[] = [
		new ReportCategory({
			name: 'Time Tracking',
			icon: copyImage('time-tracking.svg')
		}),
		new ReportCategory({
			name: 'Payments',
			icon: copyImage('payments.svg')
		}),
		new ReportCategory({
			name: 'Time Off',
			icon: copyImage('time-off.svg')
		}),
		new ReportCategory({
			name: 'Invoicing',
			icon: copyImage('invoicing.svg')
		})
	];

	await connection.manager.save(defaultCategories);

	const categoryByName = indexBy(defaultCategories, 'name');

	const reports: Report[] = [
		new Report({
			name: 'Time & Activity',
			slug: 'time-activity',
			// image: copyImage('time-activity.png'),
			category: categoryByName['Time Tracking'],
			description:
				"See team members' time worked, activity levels, and amounts earned per project or task"
		}),
		new Report({
			name: 'Weekly',
			slug: 'weekly',
			// image: copyImage('weekly.png'),
			category: categoryByName['Time Tracking'],
			description:
				"See team members' time worked, activity levels, and amount earned per week"
		}),
		new Report({
			name: 'Apps & URLs',
			slug: 'apps-urls',
			// image: copyImage('apps-urls.png'),
			category: categoryByName['Time Tracking'],
			description:
				"See team members' apps used and URLs visited while working"
		}),
		new Report({
			name: 'Manual time edits',
			slug: 'manual-time-edits',
			// image: copyImage('manual-time-edits.png'),
			category: categoryByName['Time Tracking'],
			description:
				"See team members' time worked, project, task, and reason for each manual time entry"
		}),
		new Report({
			name: 'Expense',
			slug: 'expense',
			// image: copyImage('expense.png'),
			category: categoryByName['Time Tracking'],
			description:
				'See how much has been spent on expenses by member and project.'
		}),
		new Report({
			name: 'Amounts owed',
			slug: 'amounts-owed',
			// image: copyImage('amounts-owed.png'),
			category: categoryByName['Payments'],
			description: 'See how much team members are currently owed'
		}),
		new Report({
			name: 'Payments',
			slug: 'payments',
			// image: copyImage('payments.png'),
			category: categoryByName['Payments'],
			description:
				'See how much team members were paid over a given period'
		}),
		new Report({
			name: 'Weekly limits',
			slug: 'weekly-limits',
			// image: copyImage('weekly-limits.png'),
			category: categoryByName['Time Off'],
			description: "See team members' weekly limits usage"
		}),
		new Report({
			name: 'Daily limits',
			slug: 'daily-limits',
			// image: copyImage('daily-limits.png'),
			category: categoryByName['Time Off'],
			description: "See team members' daily limits usage"
		}),
		new Report({
			name: 'Project budgets',
			slug: 'project-budgets',
			// image: copyImage('project-budgets.png'),
			category: categoryByName['Invoicing'],
			description:
				"See how much of your projects' budgets have been spent"
		}),
		new Report({
			name: 'Client budgets',
			slug: 'client-budgets',
			// image: copyImage('client-budgets.png'),
			category: categoryByName['Invoicing'],
			description: "See how much of your clients' budgets have been spent"
		})
	];

	return await connection.manager.save(reports);
};

function copyImage(fileName: string) {
	const dir = join(
		process.cwd(),
		'apps',
		'api',
		'src',
		'assets',
		'seed',
		'reports'
	);

	const baseDir = join(process.cwd(), 'apps', 'api');
	const destDir = join('public', 'reports');
	mkdirSync(join(baseDir, destDir), { recursive: true });

	const sourceFilePath = join(dir, fileName);
	const destFilePath = join(baseDir, fileName);
	copyFileSync(sourceFilePath, destFilePath);
	return destFilePath;
}
