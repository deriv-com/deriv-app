// noop
import React from 'react';
import { getStaticUrl, PlatformContext } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { Icon, Text } from '@deriv/components';
import { connect } from 'Stores/connect';

const ArticleContent = ({ is_eu, is_uk, toggleModal }) => {
    const { is_dashboard } = React.useContext(PlatformContext);

    const eu_items = [
        <Localize
            key={0}
            i18n_default_text='These trading limits and self-exclusion help you control the amount of money and time you spend on Deriv.com and exercise <0>responsible trading</0>.'
            components={[
                <a
                    key={0}
                    className='link link--orange'
                    rel='noopener noreferrer'
                    target='_blank'
                    href={getStaticUrl('/responsible', { is_dashboard })}
                />,
            ]}
        />,
    ];
    if (is_uk) {
        eu_items.push(
            <Localize
                key={1}
                i18n_default_text='These trading limits are optional, and you can strengthen them at any time. If you don’t wish to set a specific limit, leave the field blank. If you live in the United Kingdom, Customer Support can only remove or weaken your trading limits after 24 hours of receiving the request. If you live in the Isle of Man, Customer Support can only remove or weaken your trading limits after your trading limit period has expired.'
            />
        );
    } else {
        eu_items.push(
            <Localize
                key={1}
                i18n_default_text='These trading limits are optional, and you can strengthen them at any time. If you don’t wish to set a specific limit, leave the field blank. Customer Support can only remove or weaken your trading limits after 24 hours of receiving the request.'
            />
        );
    }
    eu_items.push(
        <Localize
            key={2}
            i18n_default_text='When you set your limits or self-exclusion, they will be aggregated across all your account types in DTrader and DBot. For example, the losses made on both platforms will add up and be counted towards the loss limit you set.'
        />
    );
    if (is_uk) {
        eu_items.push(
            <Localize
                key={3}
                i18n_default_text='You can also exclude yourself entirely for a specified duration. This can only be removed once your self-exclusion has expired. If you wish to continue trading once your self-exclusion period expires, you must contact Customer Support by calling <0>+447723580049</0> to lift this self-exclusion. Requests by chat or email shall not be entertained. There will be a 24-hour cooling-off period before you can resume trading.'
                components={[
                    <a
                        key={0}
                        className='link link--orange'
                        rel='noopener noreferrer'
                        target='_blank'
                        href='tel:+447723580049'
                    />,
                ]}
            />
        );
    } else {
        eu_items.push(
            <Localize
                key={3}
                i18n_default_text='You can also exclude yourself entirely for a specified duration. If, at any time, you decide to trade again, you must then contact our Customer Support to remove this self-exclusion. There will be a 24-hour-cooling-off period before you can resume trading. '
            />,
            <Localize
                key={4}
                i18n_default_text='UK clients won’t be able to remove their self-exclusion until the set period has expired. If you wish to continue trading once your self-exclusion period expires, you must contact Customer Support by calling <0>+447723580049</0> to lift this self-exclusion. Requests by chat or email shall not be entertained. There will be a 24-hour cooling-off period before you can resume trading. '
                components={[
                    <a
                        key={0}
                        className='link link--orange'
                        rel='noopener noreferrer'
                        target='_blank'
                        href='tel:+447723580049'
                    />,
                ]}
            />
        );
    }

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
                    href={getStaticUrl('/responsible', { is_dashboard })}
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
                    href={getStaticUrl('/contact-us', { is_dashboard })}
                />,
            ]}
        />,
    ];

    const article_items = is_eu ? eu_items : non_eu_items;

    return (
        <div className='self-exclusion__article'>
            <div className='self-exclusion__article-header'>
                <h3>{localize('About trading limits and self-exclusion')}</h3>
                <Icon icon='IcCross' className='self-exclusion__article-icon' onClick={toggleModal} />
            </div>
            <div className='self-exclusion__article-content'>
                <ul className='account__article-list'>
                    {article_items.map((article, idx) => (
                        <li key={idx}>
                            <Text as='p' size='xxs'>
                                {article}
                            </Text>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default connect(({ client }) => ({
    is_eu: client.is_eu,
    is_uk: client.is_uk,
}))(ArticleContent);
