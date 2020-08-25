import React from 'react';
import { getDerivComLink } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import Article from 'Components/article';

const SEArticle = ({ is_eu }) => {
    const eu_items = [
        <Localize
            key={0}
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
        <Localize
            key={1}
            i18n_default_text="Setting your limits is optional. It's up to you how much and how long you'd like to trade. If you don't wish to set a specific limit, you can leave the field blank."
        />,
        <Localize
            key={2}
            i18n_default_text='You can set your limits on any account type you choose. The limits apply to every platform. For example, if you set limits in your USD account, the limits apply to DTrader, DBot, and DMT5, individually.'
        />,
        <Localize
            key={3}
            i18n_default_text='You’ll be able to adjust these limits at any time. You can reduce your limits from the <0>self-exclusion page</0>. To increase or remove your limits, please contact our <1>Customer Support team</1>.'
            components={[
                <span key={0} className='self-exclusion__text-highlight self-exclusion__text-highlight--small' />,
                <a
                    key={1}
                    className='link link--orange'
                    rel='noopener noreferrer'
                    target='_blank'
                    href={getDerivComLink('/contact-us')}
                />,
            ]}
        />,
    ];

    const non_eu_items = [
        <Localize
            key={0}
            i18n_default_text='These self-exclusion limits help you control the amount of money and time you spend trading on DTrader, DBot, and SmartTrader. The limits you set here will help you exercise <0>responsible trading</0>.'
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
        <Localize
            key={1}
            i18n_default_text='These limits are optional, and you can adjust them at any time. You decide how much and how long you’d like to trade. If you don’t wish to set a specific limit, leave the field blank.'
        />,
        <Localize
            key={2}
            i18n_default_text='When you set your limits, they will be aggregated across all your account types in DTrader, DBot, and SmartTrader. For example, the losses made on all three platforms will add up and be counted towards the loss limit you set.'
        />,
        <Localize
            key={3}
            i18n_default_text='You can also exclude yourself entirely for a specified duration. Once the self-exclusion period has ended, you can either extend it further or resume trading immediately. If you wish to reduce or remove the self-exclusion period, contact our <0>Customer Support</0>.'
            components={[
                <a
                    key={0}
                    className='link link--orange'
                    rel='noopener noreferrer'
                    target='_blank'
                    href={getDerivComLink('/contact-us')}
                />,
            ]}
        />,
    ];

    const article_items = is_eu ? eu_items : non_eu_items;

    return <Article title={localize('About self-exclusion')} descriptions={article_items} />;
};

export default connect(({ client }) => ({
    is_eu: client.is_eu,
}))(SEArticle);
