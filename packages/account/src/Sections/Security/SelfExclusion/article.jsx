import React from 'react';
import { PropTypes } from 'prop-types';
import classNames from 'classnames';
import { Icon, StaticUrl, Text } from '@deriv/components';
import { PlatformContext, isDesktop } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import ArticleContent from './article-content.jsx';

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
            components={[<StaticUrl key={0} className='link link--orange' href='/responsible' />]}
        />
    );

    const article_text = is_eu ? eu_text : non_eu_text;

    return (
        <article className={classNames('account__article', { 'account__article-dashboard': is_dashboard })}>
            <Text
                as='h4'
                size='xs'
                color='prominent'
                weight='bold'
                align={is_dashboard ? 'left' : 'center'}
                className='account__article-title'
            >
                {localize('About trading limits and self-exclusion')}
            </Text>
            {is_dashboard && isDesktop() ? (
                <ArticleContent remove_header />
            ) : (
                <React.Fragment>
                    <Text as='p' size='xxs' className='account__article-description'>
                        {article_text}
                    </Text>
                    <div onClick={toggleArticle} className='link link--orange account__article-link'>
                        <Text size='xxs' color='loss-danger' line_height='s'>
                            {localize('Learn more')}
                        </Text>
                        <Icon icon='IcChevronRight' className='account__article-link--icon' color='red' />
                    </div>
                </React.Fragment>
            )}
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
