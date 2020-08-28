import React from 'react';
import { getDerivComLink } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { Icon } from '@deriv/components';

const SEArticle = ({ toggleArticle }) => {
    return (
        <article className='account__article'>
            <h4 className='account__article-title'>{localize('About trading limits and self-exclusion')}</h4>
            <p className='account__article-description'>
                <Localize
                    i18n_default_text='These trading limits and self-exclusion help you control the amount of money and time you spend on Deriv.com and exercise <0>responsible trading</0>.'
                    components={[
                        <a
                            key={0}
                            className='link link--orange'
                            rel='noopener noreferrer'
                            target='_blank'
                            href={getDerivComLink('/responsible-trading')}
                        />,
                    ]}
                />
            </p>
            <div onClick={toggleArticle} className='link link--orange account__article-link'>
                <span>{localize('Learn more')}</span>
                <Icon icon='IcChevronRight' className='account__article-link--icon' color='red' />
            </div>
        </article>
    );
};

export default SEArticle;
