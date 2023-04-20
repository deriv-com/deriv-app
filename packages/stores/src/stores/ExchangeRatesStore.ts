import type { ExchangeRatesResponse } from '@deriv/api-types';
import BaseStore from './BaseStore';

export default class ExchangeRatesStore extends BaseStore<ExchangeRatesResponse['exchange_rates']> {
    constructor() {
        super('ExchangeRatesStore');
    }
}
