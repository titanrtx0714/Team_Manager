import {
	Component,
	OnInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	AfterViewInit,
	forwardRef
} from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { TimeTrackerService } from './time-tracker.service';
import * as moment from 'moment';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { error } from 'console';

@Component({
	selector: 'ngx-time-tracker',
	templateUrl: './time-tracker.component.html',
	styleUrls: ['./time-tracker.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TimeTrackerComponent),
			multi: true
		}
	]
})
export class TimeTrackerComponent implements OnInit, AfterViewInit {
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
	organizationContacts: any = [];
	organization: any = {};
	projectSelect = '';
	taskSelect = '';
	errors: any = {};
	note: String = '';
	aw: Boolean = false;
	loadingAw = false;
	iconAw = 'close-square-outline';
	statusIcon = 'success';
	awCheck = false;
	defaultAwAPI = 'http:localhost:5600';
	todayDuration = {
		hours: '00',
		minutes: '00'
	};
	userOrganization: any = {};
	lastScreenCapture: any = {};
	quitApp = false;
	organizationContactId = null;
	employeeId = null;
	argFromMain = null;
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
				this.argFromMain = arg;
				this.taskSelect = arg.taskId;
				this.projectSelect = arg.projectId;
				this.note = arg.note;
				this.getClient(arg);
				this.getProjects(arg);
				this.getTask(arg);
				this.getTodayTime(arg);
				this.getUserInfo(arg);

				if (arg.timeSlotId) {
					this.getLastTimeSlotImage(arg);
				}
			}
		);

		this.electronService.ipcRenderer.on('start_from_tray', (event, arg) => {
			this.toggleStart(true);
		});

		this.electronService.ipcRenderer.on('stop_from_tray', (event, arg) => {
			if (arg && arg.quitApp) this.quitApp = true;
			this.toggleStart(false);
		});

		this.electronService.ipcRenderer.on(
			'set_project_task_reply',
			(event, arg) => {
				this.setProject(arg.projectId);
				this.setTask(arg.taskId);
				this.note = arg.note;
				this.aw = arg.aw && arg.aw.isAw ? arg.aw.isAw : false;
				_cdr.detectChanges();
			}
		);

		this.electronService.ipcRenderer.on('take_screenshot', (event, arg) => {
			const thumbSize = this.determineScreenshot();
			this.electronService.desktopCapturer
				.getSources({ types: ['screen'], thumbnailSize: thumbSize })
				.then((sources) => {
					const screens = [];
					sources.forEach(async (source, i) => {
						screens.push({
							img: source.thumbnail.toPNG(),
							name: source.name,
							id: source.display_id
						});
					});
					event.sender.send('save_screen_shoot', {
						screens: screens,
						timeSlotId: arg.timeSlotId,
						quitApp: this.quitApp
					});
				});
		});

		this.electronService.ipcRenderer.on(
			'refresh_time_log',
			(event, arg) => {
				this.getTodayTime(arg);
			}
		);

		this.electronService.ipcRenderer.on(
			'show_last_capture',
			(event, arg) => {
				this.getLastTimeSlotImage(arg);
			}
		);
	}

	ngOnInit(): void {
		// this.getTask()
		// console.log('init', this.projectSelect);
		this.electronService.ipcRenderer.send('time_tracker_ready');
	}

	ngAfterViewInit(): void {
		this.electronService.ipcRenderer.send('time_tracker_ready');
	}

	toggleStart(val) {
		if (this.validationField()) {
			this.start = val;
			if (this.start) {
				this.startTime();
			} else {
				this.stopTimer();
				this._cdr.detectChanges();
			}
		}
	}

	setTime(value) {
		if (!this.start) this.start = true;
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
		if (value.second % 60 === 0) {
			this.electronService.ipcRenderer.send('update_tray_time_update', {
				hours: this.timeRun.hours,
				minutes: this.timeRun.minute
			});
		}

		if (value.second % 5 === 0) {
			this.pingAw(null);
		}
		this._cdr.detectChanges();
	}

	startTime() {
		this.electronService.ipcRenderer.send('start_timer', {
			projectId: this.projectSelect,
			taskId: this.taskSelect,
			note: this.note,
			organizationContactId: this.organizationContactId,
			aw: {
				host: this.defaultAwAPI,
				isAw: this.aw
			}
		});

		this.electronService.ipcRenderer.send('update_tray_start');
	}

	stopTimer() {
		this.electronService.ipcRenderer.send('stop_timer', {
			quitApp: this.quitApp
		});
		this.electronService.ipcRenderer.send('update_tray_stop');
		this.electronService.ipcRenderer.send('update_tray_time_update', {
			hours: '00',
			minutes: '00'
		});
		this.timeRun = {
			second: '00',
			minute: '00',
			hours: '00'
		};
	}

	async getTask(arg) {
		this.tasks = await this.timeTrackerService.getTasks(arg);
	}

	async getProjects(arg) {
		this.projects = await this.timeTrackerService.getProjects(arg);
	}

	async getClient(arg) {
		this.organizationContacts = await this.timeTrackerService.getClient(
			arg
		);
	}

	async setClient(item) {
		this.organizationContactId = item;
		if (item) {
			this.projects = this.projects.filter(
				(p) => p.organizationContactId === item
			);
			this.projectSelect = null;
			this.taskSelect = null;
			this.errors.client = false;
		} else {
			this.projects = await this.timeTrackerService.getProjects(
				this.argFromMain
			);
		}
	}

	async setProject(item) {
		this.projectSelect = item;
		if (item) {
			this.tasks = this.tasks.filter((t) => t.projectId === item);
			this.taskSelect = null;
			this.errors.project = false;
		} else {
			this.tasks = await this.timeTrackerService.getTasks(
				this.argFromMain
			);
		}
		this.errorBind();
		this._cdr.detectChanges();
	}

	setTask(item) {
		this.taskSelect = item;
		if (item) this.errors.task = false;
	}

	descriptionChange(e) {
		if (e) this.errors.note = false;
	}

	setAW(event) {
		if (event.target.checked) {
			this.aw = true;
			this.electronService.ipcRenderer.send('set_tp_aw', {
				host: this.defaultAwAPI,
				isAw: true
			});
		} else {
			this.electronService.ipcRenderer.send('set_tp_aw', {
				host: this.defaultAwAPI,
				isAw: false
			});
			this.aw = false;
		}
		this._cdr.detectChanges();
		if (this.aw) this.pingAw(null);
		else {
			this.awCheck = false;
			this._cdr.detectChanges();
		}
	}

	pingAw(host) {
		this.loadingAw = true;
		this.awCheck = false;
		this.timeTrackerService
			.pingAw(`${host || this.defaultAwAPI}/api`)
			.then((res) => {
				this.iconAw = 'checkmark-square-outline';
				this.awCheck = true;
				this.statusIcon = 'success';
				this._cdr.detectChanges();
			})
			.catch((e) => {
				if (e.status === 200) {
					this.iconAw = 'checkmark-square-outline';
					this.awCheck = true;
					this.statusIcon = 'success';
					this._cdr.detectChanges();
					this.loadingAw = false;
				} else {
					this.loadingAw = false;
					this.iconAw = 'close-square-outline';
					this.awCheck = true;
					this.statusIcon = 'danger';
					this._cdr.detectChanges();
				}
			});
	}

	validationField() {
		this.errorBind();
		const errors = [];
		const requireField = {
			task: 'requireTask',
			project: 'requireProject',
			client: 'requireClient',
			note: 'requireDescription'
		};
		Object.keys(this.errors).forEach((key) => {
			if (this.errors[key] && this.userOrganization[requireField[key]])
				errors.push(true);
		});
		return errors.length === 0;
	}

	errorBind() {
		if (!this.projectSelect && this.userOrganization.requireProject)
			this.errors.project = true;
		if (!this.taskSelect && this.userOrganization.requireTask)
			this.errors.task = true;
		if (!this.organizationContactId && this.userOrganization.requireClient)
			this.errors.client = true;
		if (!this.note && this.userOrganization.requireDescription)
			this.errors.note = true;
	}

	doshoot() {
		console.log('shoot');
		this.electronService.ipcRenderer.send('screen_shoot');
	}

	determineScreenshot() {
		const screensize = this.electronService.screen.getPrimaryDisplay()
			.workAreaSize;
		const maxDimension = Math.max(screensize.width, screensize.height);
		console.log(maxDimension);

		return {
			width: maxDimension * window.devicePixelRatio,
			height: maxDimension * window.devicePixelRatio
		};
	}

	getTodayTime(arg) {
		this.timeTrackerService.getTimeLogs(arg).then((res: any) => {
			if (res && res.length > 0) {
				this.countDurationToday(res);
			}
		});
	}

	countDurationToday(items) {
		const workToday = {
			hours: 0,
			seconds: 0
		};
		items.forEach((item) => {
			const stopItem = item.stoppedAt ? item.stoppedAt : new Date();
			const itemDurationHours = moment(stopItem).diff(
				moment(item.startedAt),
				'hours'
			);
			const itemDurationSeconds = moment(stopItem).diff(
				moment(item.startedAt),
				'seconds'
			);
			workToday.hours += itemDurationHours;
			workToday.seconds += itemDurationSeconds;
		});
		this.todayDuration = {
			hours: this.formatingDuration('hours', workToday.hours),
			minutes: this.formatingDuration(
				'minutes',
				Math.floor(workToday.seconds / 60)
			)
		};
		this._cdr.detectChanges();
	}

	formatingDuration(timeEntity, val) {
		switch (timeEntity) {
			case 'hours': {
				return val.toString().length > 1 ? `${val}` : `0${val}`;
			}
			case 'minutes': {
				const minteBackTime = val % 60;
				return val.toString().length > 1
					? `${minteBackTime}`
					: `0${minteBackTime}`;
			}
			default:
				return '00';
		}
	}

	getLastTimeSlotImage(arg) {
		this.timeTrackerService.getTimeSlot(arg).then((res: any) => {
			this.lastScreenCapture =
				res.screenshots && res.screenshots.length > 0
					? res.screenshots[0]
					: '';
			if (this.lastScreenCapture.createdAt) {
				this.lastScreenCapture.textTime = moment(
					this.lastScreenCapture.createdAt
				).fromNow();
			}
			this._cdr.detectChanges();
		});
	}

	getUserInfo(arg) {
		this.timeTrackerService.getUserDetail(arg).then((res: any) => {
			if (res.employee && res.employee.organization) {
				this.userOrganization = res.employee.organization;
				this._cdr.detectChanges();
			}
		});
	}
}
