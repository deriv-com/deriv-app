import { api_base } from '@api-base';
import { observer as globalObserver } from '@utilities/observer';

export default class NetworkMonitor {
    constructor(apiInstance, parentElement) {
        this.parentElement = parentElement;
        this.addEvents();
    }
    addEvents() {
        if ('onLine' in navigator) {
            window.addEventListener('online', () => this.setStatus());
            window.addEventListener('offline', () => this.setStatus());
        } else {
            navigator.onLine = true;
            setInterval(() => this.setStatus(), 10000);
        }
        this.setStatus();
    }
    setStatus() {
        if (navigator.onLine) {
            this.parentElement.html('<span class=\'connecting\'></span>');
            api_base.api
                .send({ ping: '1' })
                .then(() => {
                    this.parentElement.html('<span class=\'online\'></span>');
                })
                .catch(e => globalObserver.emit('Error', e));
        } else {
            this.parentElement.html('<span class=\'offline\'></span>');
        }
    }
}
