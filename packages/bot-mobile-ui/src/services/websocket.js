import DerivAPI from '@deriv/deriv-api/dist/DerivAPI';

class DerivSocket {
    static singleton;

    constructor() {
        this.app_id = 1;
        this.endpoint = 'frontend.binaryws.com';
        this.is_connected = false;
        this.api = new DerivAPI({
            endpoint: this.endpoint,
            app_id: this.app_id
        });

        this.api.basic.onOpen().subscribe(() => {
            this.is_connected = true;
        });

        return this.api;
    }

    static setInstance() {
        if (!this.singleton) {
            this.singleton = new DerivSocket();
        }
        return this.singleton;
    }

    static get instance() {
        if (this.singleton) {
            return this.singleton;
        }
        
        return this.setInstance();
    }
};

export default DerivSocket;