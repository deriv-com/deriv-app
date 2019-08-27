import PendingPromise from '../../../utils/pending-promise';

export default class ServerTime {
    constructor(ws) {
        this.clock_started         = false;
        this.init_promise          = new PendingPromise();
        this.ws                    = ws;
        this.init();
    }

    async init() {
        if (!this.clock_started) {
            this.clock_started = true;
            clearInterval(this.getTimeInterval);
            await this.requestTime();
            this.getTimeInterval = setInterval(this.requestTime.bind(this), 30000);
        }

        return this.init_promise;
    }

    async requestTime() {
        this.client_time_at_request = this.getUTCEpoch(new Date());
        const time_response = await this.ws.sendRequest({ time: 1 });
        this.processTimeResponse(time_response);
        this.init_promise.resolve();
    }

    processTimeResponse(response) {
        if (response.error) {
            this.clock_started = false;
        }

        if (!this.clock_started) {
            this.init();
            return;
        }

        const server_time             = response.time;
        const client_time_at_response = this.getUTCEpoch(new Date());
        this.server_time_at_response  = server_time + ((client_time_at_response - this.client_time_at_request) / 2);

        const updateTime = () => {
            this.server_time_at_response += 1;
        };

        clearInterval(this.updateTimeInterval);
        this.updateTimeInterval = setInterval(updateTime, 1000);
    }

    getEpoch() {
        if (this.server_time_at_response) {
            return this.server_time_at_response;
        }

        throw new Error('Server time is undefined');
    }

    getLocalDate() {
        return this.getLocalDateByEpoch(this.getEpoch());
    }
    
    // eslint-disable-next-line class-methods-use-this
    getLocalDateByEpoch(epoch) {
        return new Date(epoch * 1000);
    }

    // eslint-disable-next-line class-methods-use-this
    getUTCEpoch(date) {
        return (date.getTime() / 1000) - (date.getTimezoneOffset() * 60);
    }
    
    // eslint-disable-next-line class-methods-use-this
    getUTCDate(epoch) {
        const utc_date = new Date(epoch * 1000).toISOString();

        return utc_date.substring(0, 19);
    }
}
