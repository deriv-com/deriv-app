import React from 'react';
import { localize, Localize } from '@deriv/translations';
import AccountArticle from 'Components/article';

const openDerivAPIWebsite = () => {
    window.open('https://api.deriv.com/', '_blank', 'noopener');
};

const ConnectedAppsEarnMore = () => (
    <AccountArticle
        className='connected-apps__article'
        title={localize('Earn more with Deriv API')}
        descriptions={[
            <Localize
                key={0}
                i18n_default_text='Use our powerful, flexible, and free API to build a custom trading platform for yourself or for your business.'
            />,
        ]}
        onClickLearnMore={openDerivAPIWebsite}
    />
);

export default ConnectedAppsEarnMore;
