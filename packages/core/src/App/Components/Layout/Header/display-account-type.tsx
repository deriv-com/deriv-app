import React from 'react';
import { Localize } from '@deriv/translations';

type TDisplayAccountType = {
    account_type: string;
    country_standpoint: {
        is_isle_of_man?: boolean;
        is_united_kingdom?: boolean;
        is_belgium?: boolean;
    };
    is_eu: boolean;
};

const DisplayAccountType = ({ account_type, country_standpoint, is_eu }: TDisplayAccountType) => {
    if (account_type === 'financial') {
        return <Localize i18n_default_text='Multipliers' />;
    } else if (account_type === 'gaming') {
        if (country_standpoint.is_isle_of_man) return null;
        if (country_standpoint.is_united_kingdom) {
            return <Localize i18n_default_text='Gaming' />;
        }
        if (is_eu || country_standpoint.is_belgium) {
            return <Localize i18n_default_text='Options' />;
        }
        return <Localize i18n_default_text='Derived' />;
    }
    return null;
};

export default DisplayAccountType;
