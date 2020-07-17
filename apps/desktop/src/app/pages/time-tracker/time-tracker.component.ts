import {
	Component,
	OnInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef
} from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { TimeTrackerService } from './time-tracker.service';

@Component({
	selector: 'ngx-time-tracker',
	templateUrl: './time-tracker.component.html',
	styleUrls: ['./time-tracker.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default
})
export class TimeTrackerComponent implements OnInit {
	start: Boolean = false;
	timeRun: any = {
		second: '00',
		minute: '00',
		hours: '00'
	};
	TimeDay: {
		second: 0;
		minute: 0;
		hours: 0;
	};

	userData: any;
	projects: any;
	tasks: any = [];
	organization: any = {};
	projectSelect = '';
	taskSelect = '';
	errors: any = {};
	note: String = '';

	constructor(
		private electronService: ElectronService,
		private _cdr: ChangeDetectorRef,
		private timeTrackerService: TimeTrackerService
	) {
		this.electronService.ipcRenderer.on('timer_push', (event, arg) => {
			this.setTime(arg);
		});

		this.electronService.ipcRenderer.on(
			'timer_tracker_show',
			(event, arg) => {
				this.getTask(arg);
			}
		);

		this.electronService.ipcRenderer.on('start_from_tray', (event, arg) => {
			this.toggleStart();
		});

		this.electronService.ipcRenderer.on('stop_from_tray', (event, arg) => {
			this.toggleStart();
		});
	}

	ngOnInit(): void {
		// this.getTask()
	}

	toggleStart() {
		this.start = !this.start;
		if (this.start) {
			console.log('start');
			this.startTime();
		} else {
			this.stopTimer();
			this._cdr.detectChanges();
		}
	}

	setTime(value) {
		value.second = value.second % 60;
		value.minute = value.minute % 60;
		this.timeRun = {
			second:
				value.second.toString().length > 1
					? `${value.second}`
					: `0${value.second}`,
			minute:
				value.minute.toString().length > 1
					? `${value.minute}`
					: `0${value.minute}`,
			hours:
				value.hours.toString().length > 1
					? `${value.hours}`
					: `0${value.hours}`
		};
		this._cdr.detectChanges();
		console.log('time running');
	}

	startTime() {
		if (!this.projectSelect) this.errors.project = true;
		if (!this.taskSelect) this.errors.task = true;
		if (!this.errors.task && !this.errors.project) {
			this.electronService.ipcRenderer.send('start_timer', {
				projectId: this.projectSelect,
				taskId: this.taskSelect,
				note: this.note
			});
		}
	}

	stopTimer() {
		this.electronService.ipcRenderer.send('stop_timer');
		this.timeRun = {
			second: '00',
			minute: '00',
			hours: '00'
		};
	}

	getTask(arg) {
		this.timeTrackerService.getTasks(arg).then((res: any) => {
			this.organization = res.items;
			this.getProjects(this.organization, arg);
		});
	}

	getProjects(items, arg) {
		this.projects = items.map((item) => item.project);
		if (this.projects.length > 0) {
			if (arg.projectId && arg.taskId) {
				this.projectSelect = arg.projectId;
				this.taskSelect = arg.taskId;
				this.note = arg.note;
				this._cdr.detectChanges();
			}
		}
	}

	setProject(item) {
		console.log(item);
		this.projectSelect = item;
		this.tasks = this.organization.filter((t) => t.project.id === item);
	}

	setTask(item) {
		this.taskSelect = item;
	}
}
