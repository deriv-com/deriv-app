import React from 'react';
import { Icon, StaticUrl } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const SEArticle = ({ toggleArticle, is_eu }) => {
    const non_eu_text = (
        <Localize
            i18n_default_text='These self-exclusion limits help you control the amount of money and time you spend trading on DTrader, DBot, and SmartTrader. The limits you set here will help you exercise <0>responsible trading</0>.'
            components={[<StaticUrl key={0} className='link link--orange' href='/responsible-trading' />]}
        />
    );

    const eu_text = (
        <Localize
            i18n_default_text='These trading limits and self-exclusion help you control the amount of money and time you spend on Deriv.com and exercise <0>responsible trading</0>.'
            components={[<StaticUrl key={0} className='link link--orange' href='/responsible-trading' />]}
        />
    );

    const article_text = is_eu ? eu_text : non_eu_text;
    return (
        <article className='account__article'>
            <h4 className='account__article-title'>{localize('About trading limits and self-exclusion')}</h4>
            <p className='account__article-description'>{article_text}</p>
            <div onClick={toggleArticle} className='link link--orange account__article-link'>
                <span>{localize('Learn more')}</span>
                <Icon icon='IcChevronRight' className='account__article-link--icon' color='red' />
            </div>
        </article>
    );
};

export default connect(({ client }) => ({
    is_eu: client.is_eu,
}))(SEArticle);
