import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Candidate, ICandidateInterview } from '@gauzy/models';
import { CandidateInterviewService } from 'apps/gauzy/src/app/@core/services/candidate-interview.service';
import { CandidateFeedbacksService } from 'apps/gauzy/src/app/@core/services/candidate-feedbacks.service';
import { EmployeesService } from 'apps/gauzy/src/app/@core/services';

@Component({
	selector: 'ga-interviewer-assessment-chart',
	template: `
		<h6 style="  margin: 2rem 0 0 0 ;">
			{{ 'CANDIDATES_PAGE.STATISTIC.INTERVIEWER_ASSESSMENT' | translate }}
		</h6>
		<nb-select
			placeholder="Select an interview"
			style=" width: 100%; margin: 2rem 0;"
			(selectedChange)="onInterviewSelected($event)"
		>
			<nb-option-group
				*ngFor="let candidate of candidates"
				title="{{ candidate.user.name }}"
			>
				<nb-option
					*ngFor="let interview of candidate.interview"
					[value]="interview"
				>
					{{ interview.title }}
				</nb-option>
			</nb-option-group>
		</nb-select>

		<chart
			style="height: 400px; width: 100%;"
			type="bar"
			[data]="data"
			[options]="options"
		></chart>
	`
})
export class InterviewerAssessmentChartComponent implements OnInit, OnDestroy {
	labels: string[] = [];
	rating: number[] = [];
	interviews = [];
	@Input() candidates: Candidate[];
	data: any;
	options: any;
	currentInterview: ICandidateInterview;
	backgroundColor: string[] = [];
	private _ngDestroy$ = new Subject<void>();
	constructor(
		private themeService: NbThemeService,
		private candidateFeedbacksService: CandidateFeedbacksService,
		private candidateInterviewService: CandidateInterviewService,
		private employeesService: EmployeesService
	) {}

	ngOnInit() {
		this.loadData();
		this.loadChart();
	}
	async onInterviewSelected(interview: ICandidateInterview) {
		this.currentInterview = interview;
		this.rating = [];
		this.labels = [];
		const res = await this.candidateFeedbacksService.getAll(
			['interviewer'],
			{
				candidateId: interview.candidateId
			}
		);
		if (res) {
			const feedbacks = res.items.filter(
				(item) => item.interviewId && item.interviewId === interview.id
			);
			for (const item of feedbacks) {
				this.rating.push(item.rating);
				const employee = await this.employeesService.getEmployeeById(
					item.interviewer.employeeId,
					['user']
				);
				if (employee) {
					this.labels.push(employee.user.name);
				}
			}
			this.loadChart();
		}
	}
	private loadChart() {
		this.themeService
			.getJsTheme()
			.pipe(takeUntil(this._ngDestroy$))
			.subscribe(() => {
				(this.data = {
					labels: this.labels,
					datasets: [
						{
							maxBarThickness: 150,
							label: 'Candidate rating per interview',
							backgroundColor: this.backgroundColor,
							data: this.rating
						}
					]
				}),
					(this.options = {
						responsive: true,
						maintainAspectRatio: false,
						elements: {
							rectangle: {
								borderWidth: 2
							}
						},
						scales: {
							yAxes: [
								{
									ticks: {
										beginAtZero: true
									}
								}
							]
						}
					});
			});
	}

	async loadData() {
		for (let i = 0; i < this.candidates.length; i++) {
			const interviews = await this.candidateInterviewService.findByCandidateId(
				this.candidates[i].id
			);
			this.candidates[i].interview = interviews ? interviews : null;

			const color =
				i % 2 === 0
					? 'rgba(153, 102, 255, 0.2)'
					: 'rgba(255, 159, 64, 0.2)';
			this.backgroundColor.push(color);
		}
	}

	ngOnDestroy() {
		this._ngDestroy$.next();
		this._ngDestroy$.complete();
	}
}
