import React from 'react';
import Article from 'Components/article';
import { getDerivComLink } from '@deriv/shared/utils/url';
import { localize, Localize } from '@deriv/translations';

const SEArticle = () => (
    <Article
        title={localize('About self-exclusion')}
        descriptions={[
            <Localize
                i18n_default_text='Self-exclusion helps you control the amount of money and time you spend on your trading activities. The limits you set here will help you exercise <0>responsible trading</0>.'
                components={[
                    <a
                        key={0}
                        className='link link--orange'
                        rel='noopener noreferrer'
                        target='_blank'
                        href={getDerivComLink('/responsible-trading')}
                    />,
                ]}
            />,
            <Localize i18n_default_text="Setting your limits is optional. It's up to you how much and how long you'd like to trade. If you don't wish to set a specific limit, you can leave the field blank." />,
            <Localize i18n_default_text='You can set your limits on any account type you choose. The limits apply to every platform. For example, if you set limits in your USD account, the limits apply to DTrader, DBot, and DMT5, individually.' />,
            <Localize
                i18n_default_text='You’ll be able to adjust these limits at any time. You can reduce your limits from the <0>self-exclusion page</0>. To increase or remove your limits, please contact our <1>Customer Support team</1>.'
                components={[
                    <span key={0} className='self-exclusion__text--red' />,
                    <a
                        key={1}
                        className='link link--orange'
                        rel='noopener noreferrer'
                        target='_blank'
                        href={getDerivComLink('/contact-us')}
                    />,
                ]}
            />,
        ]}
    />
);

export default SEArticle;
