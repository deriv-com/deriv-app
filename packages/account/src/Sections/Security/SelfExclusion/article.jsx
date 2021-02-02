import React from 'react';
import { PropTypes } from 'prop-types';
import classNames from 'classnames';
import { Icon, StaticUrl, Text } from '@deriv/components';
import { PlatformContext } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const SEArticle = ({ toggleArticle, is_eu }) => {
    const { is_dashboard } = React.useContext(PlatformContext);
    const non_eu_text = (
        <Localize
            i18n_default_text='These self-exclusion limits help you control the amount of money and time you spend trading on DTrader, DBot, and SmartTrader. The limits you set here will help you exercise <0>responsible trading</0>.'
            components={[<StaticUrl key={0} className='link link--orange' href='/responsible' />]}
        />
    );

    const eu_text = (
        <Localize
            i18n_default_text='These trading limits and self-exclusion help you control the amount of money and time you spend on Deriv.com and exercise <0>responsible trading</0>.'
            components={[
                <StaticUrl
                    key={0}
                    className={classNames('link', 'link--orange', { 'link--blue': is_dashboard })}
                    href='/responsible'
                />,
            ]}
        />
    );

    const article_text = is_eu ? eu_text : non_eu_text;
    if (is_dashboard) {
        return (
            <article className='account__article'>
                <h4 className='account__article-title'>{localize('About trading limits and self-exclusion')}</h4>
                <Text as='p' size='xxs' className='account__article-description'>
                    <Localize
                        i18n_default_text='These self-exclusion limits help you control the amount of money and time you spend trading on DTrader, DBot, and SmartTrader. The limits you set here will help you exercise <0>responsible trading.</0>'
                        components={[
                            <StaticUrl
                                key={0}
                                className={classNames('link', 'link--orange', { 'link--blue': is_dashboard })}
                                href='/responsible-trading'
                            />,
                        ]}
                    />
                </Text>
                <Text as='p' size='xxs' className='account__article-description'>
                    <Localize i18n_default_text='These limits are optional, and you can adjust them at any time. You decide how much and how long you’d like to trade. If you don’t wish to set a specific limit, leave the field blank.' />
                </Text>
                <Text as='p' size='xxs' className='account__article-description'>
                    <Localize i18n_default_text='When you set your limits, they will be aggregated across all your account types in DTrader, DBot, and SmartTrader. For example, the losses made on all three platforms will add up and be counted towards the loss limit you set.' />
                </Text>
                <Text as='p' size='xxs' className='account__article-description'>
                    <Localize
                        i18n_default_text='You can also exclude yourself entirely for a specified duration. Once the self-exclusion period has ended, you can either extend it further or resume trading immediately. If you wish to reduce or remove the self-exclusion period, contact our <0>Customer Support.</0>'
                        components={[
                            <StaticUrl
                                key={0}
                                className={classNames('link', 'link--orange', { 'link--blue': is_dashboard })}
                                href='/responsible-trading'
                            />,
                        ]}
                    />
                </Text>
            </article>
        );
    }

    return (
        <article className='account__article'>
            <h4 className='account__article-title'>{localize('About trading limits and self-exclusion')}</h4>
            <Text as='p' size='xxs' className='account__article-description'>
                {article_text}
            </Text>
            <div onClick={toggleArticle} className='link link--orange account__article-link'>
                <Text size='xxs' color='loss-danger' line_height='s'>
                    {localize('Learn more')}
                </Text>
                <Icon icon='IcChevronRight' className='account__article-link--icon' color='red' />
            </div>
        </article>
    );
};

SEArticle.propTypes = {
    is_eu: PropTypes.bool,
    toggleArticle: PropTypes.func,
};

export default connect(({ client }) => ({
    is_eu: client.is_eu,
}))(SEArticle);
