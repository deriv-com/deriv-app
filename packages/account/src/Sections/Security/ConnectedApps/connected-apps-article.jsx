import React from 'react';
import { localize, Localize } from '@deriv/translations';
import AccountArticle from 'Components/article';

const openAPIManagingWebsite = () => {
    window.open(
        'https://community.deriv.com/t/api-tokens-managing-access-on-third-party-applications-and-mobile-apps/29159',
        '_blank'
    );
};

const ConnectedAppsArticle = () => (
    <AccountArticle
        className='connected-apps__article'
        title={localize('Want to know more about APIs?')}
        descriptions={[
            <Localize
                key={0}
                i18n_default_text='Go to our Deriv community and learn about APIs, API tokens, ways to use Deriv APIs, and more.'
            />,
        ]}
        onClickLearnMore={openAPIManagingWebsite}
    />
);

export default ConnectedAppsArticle;
