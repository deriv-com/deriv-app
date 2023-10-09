import * as React from 'react';
import { Localize, localize } from '@deriv/translations';
import AccountArticle from 'Components/article';

const AccountLimitsArticle = () => {
    const getDescription = () => {
        const description = [
            <Localize key={0} i18n_default_text='These are default limits that we apply to your accounts.' />,
        ];

        return description;
    };

    return <AccountArticle title={localize('Account limits')} descriptions={getDescription()} />;
};

export default AccountLimitsArticle;
