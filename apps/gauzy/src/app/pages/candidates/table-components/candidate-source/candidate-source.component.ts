import { Component, Input } from '@angular/core';

@Component({
	template: `
		<div class="text-center">
			<strong class="d-block">
				{{ rowData.source?.name }}
			</strong>
		</div>
	`
})
export class CandidateSourceComponent {
	@Input() rowData: any;
	@Input() value: string | number;
}
