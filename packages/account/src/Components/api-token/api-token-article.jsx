import React from 'react';
import { localize, Localize } from '@deriv/translations';
import AccountArticle from 'Components/article';

const ApiTokenArticle = () => (
    <AccountArticle
        title={localize('API token')}
        descriptions={[
            <Localize
                key={0}
                i18n_default_text="To access your mobile apps and other third-party apps, you'll first need to generate an API token."
            />,
        ]}
    />
);

export default ApiTokenArticle;
