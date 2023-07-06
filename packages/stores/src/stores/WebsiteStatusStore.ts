import type { ServerStatusResponse } from '@deriv/api-types';
import BaseStore from './BaseStore';

export default class WebsiteStatusStore extends BaseStore<ServerStatusResponse['website_status']> {
    constructor() {
        super('WebsiteStatusStore');
    }
}
