import { DetailsOfEachMT5Loginid } from '@deriv/api-types';

export type TNewDetailsOfEachMT5Loginid = Required<
    Omit<DetailsOfEachMT5Loginid, 'market_type'> & { market_type?: 'financial' | 'synthetic' | 'all' }
>;
