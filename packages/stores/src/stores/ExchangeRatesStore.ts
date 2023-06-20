import BaseStore from './BaseStore';
import type { ExchangeRatesResponse } from '@deriv/api-types';

export default class ExchangeRatesStore extends BaseStore<ExchangeRatesResponse['exchange_rates']> {
    constructor() {
        super('ExchangeRatesStore');
    }
}
