import EventEmitter from 'events';
import { NetworkStateManager } from '../contexts';
import { ApiServerConnectivity } from '../states';
import { IOfflineMode } from '../interfaces';

export class DesktopOfflineModeHandler
	extends EventEmitter
	implements IOfflineMode
{
	private static _instance: DesktopOfflineModeHandler;
	private _isEnabled: boolean;
	private _pingTimer: any;
	private _PING_INTERVAL: number;
	/**
	 * Build the class with default constructor
	 */
	private constructor() {
		super();
		// Initial status
		this._isEnabled = false;
		// Initial server ping timer
		this._pingTimer = null;
		// Default ping timer interval
		this._PING_INTERVAL = 30 * 1000;
	}
	/**
	 * Triggers offline mode on.
	 * @returns {void}
	 */
	public trigger(): void {
		// Ignore if triggered
		if (this._isEnabled) return;
		// Turn offline mode on
		this._isEnabled = true;
		// Notify that offline mode is enabled
		this.emit('offline');
		// Connectivity check timer state
		this._pingTimer = setInterval(async () => {
			// Check connectivity
			const networkContext = new NetworkStateManager(
				new ApiServerConnectivity()
			);
			const connectivityEstablished = await networkContext.established();
			console.log('[NetworkContext]: ', connectivityEstablished);
			// If connection is not restored
			if (!connectivityEstablished) {
				return console.log(
					'[OfflineModeHandler]:',
					'Connection still not restored'
				);
			}
			// Call offline mode restore routine
			return this.restore();
		}, this._PING_INTERVAL);
	}
	/**
	 * Cancels offline mode
	 * @returns {void}
	 */
	public restore(): void {
		// Connection restored
		if (!this._isEnabled) {
			return;
		}
		// Reset timer
		clearInterval(this._pingTimer);
		this._pingTimer = null;
		// Reset state
		this._isEnabled = false;
		// Notify about reconnection event
		this.emit('connection-restored');
	}
	/**
	 * Returns status of offline mode (true if enabled)
	 * @returns {Boolean} Is offline mode enabled?
	 */
	public get enabled(): boolean {
		return this._isEnabled;
	}
	/**
	 * Single instance of offline mode handler
	 * @type {DesktopOfflineModeHandler}
	 */
	public static get instance(): DesktopOfflineModeHandler {
		if (!this._instance) {
			this._instance = new DesktopOfflineModeHandler();
		}
		return this._instance;
	}
}
