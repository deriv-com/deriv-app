import BaseStore from './BaseStore';
import type { ServerStatusResponse } from '@deriv/api-types';

export default class WebsiteStatusStore extends BaseStore<ServerStatusResponse['website_status']> {
    constructor() {
        super('WebsiteStatusStore');
    }
}
