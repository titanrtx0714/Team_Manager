import { IBaseWindow } from '../interfaces';
import { BrowserWindow } from 'electron';
import * as remoteMain from '@electron/remote/main';
import * as url from 'url';
import { IWindowConfig } from '../interfaces/iwindow-config';

export class DefaultWindow implements IBaseWindow {
	private _browserWindow: BrowserWindow;

	constructor(public readonly config: IWindowConfig) {
		this._browserWindow = new BrowserWindow(this.config.options);
		remoteMain.enable(this._browserWindow.webContents);
		this._browserWindow.hide();
		this._browserWindow.on('close', (e) => {
			e.preventDefault();
			this._browserWindow.hide();
		});
	}

	public async loadURL(): Promise<void> {
		if (!this.config.path) return;
		try {
			const launchPath = url.format({
				pathname: this.config.path,
				protocol: 'file:',
				slashes: true,
				hash: this.config.hash,
			});
			await this._browserWindow.loadURL(launchPath);
			console.log('launched electron with:', launchPath);
		} catch (error) {
			console.log(error);
		}
	}

	public show(): void {
		if (!this._browserWindow) return;
		this._browserWindow.show();
	}

	public hide(): void {
		if (!this._browserWindow) return;
		this._browserWindow.hide();
	}

	public close(): void {
		this.hide();
		this._browserWindow.destroy();
		this._browserWindow = null;
	}

	public get browserWindow(): BrowserWindow {
		return this._browserWindow;
	}
}
