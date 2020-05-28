import React from 'react';
import { localize } from '@deriv/translations';

const Article = () => {
    return (
        <article className='api-token__article'>
            <h4 className='api-token__article-title'>{localize('API token')}</h4>
            <ul className='api-token__article-list'>
                <li>
                    <p className='api-token__article-text'>
                        {localize(
                            "To access our mobile apps and other third-party apps, you'll first need to generate an API token."
                        )}
                    </p>
                </li>
            </ul>
        </article>
    );
};

export default Article;
