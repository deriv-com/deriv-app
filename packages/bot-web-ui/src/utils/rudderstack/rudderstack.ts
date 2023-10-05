import * as RudderAnalytics from 'rudder-sdk-js';
import { observer as globalObserver } from '@deriv/bot-skeleton';

export type TAccountType = 'CRW' | 'MX' | 'VRW' | 'CH' | 'MFW' | 'VRTC' | 'VRCH' | 'MLT' | 'MF' | 'CRA' | 'CR';

export type TEvents = {
    account_type?: TAccountType;
    device_type?: string;
    action?: string;
    form_source?: string;
    language?: string;
    search_string?: string;
};

interface IRudderStack {
    initialize: () => void;
    identify: (user_id: string, payload: TEvents) => void;
    trackActions: (event: string, properties: TEvents) => void;
    reset: () => void;
}

export class RudderStack implements IRudderStack {
    private RUDDERSTACK_WRITE_KEY: string = process.env.RUDDERSTACK_STAGING_KEY || '';
    private RUDDERSTACK_URL: string = process.env.RUDDERSTACK_URL || '';
    has_initialized = false;
    has_identified = false;

    constructor() {
        this.initialize();
    }

    initialize() {
        try {
            RudderAnalytics.load(this.RUDDERSTACK_WRITE_KEY, this.RUDDERSTACK_URL);
            RudderAnalytics.ready(() => {
                this.has_initialized = true;
            });
        } catch (error) {
            globalObserver.emit('RudderStack initialize error:', error);
        }
    }

    identify(user_id: string, payload: TEvents) {
        try {
            RudderAnalytics.identify(user_id, payload);
            this.has_identified = true;
        } catch (error) {
            globalObserver.emit('RudderStack identify error:', error);
        }
    }

    trackActions(event: string, properties: TEvents) {
        try {
            if (this.has_identified) {
                RudderAnalytics.track(event, properties);
            }
        } catch (error) {
            globalObserver.emit('RudderStack tracking error:', error);
        }
    }

    reset() {
        try {
            RudderAnalytics.reset();
            this.has_identified = false;
        } catch (error) {
            globalObserver.emit('RudderStack reset error:', error);
        }
    }
}
