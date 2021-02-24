import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Text } from '@deriv/components';

const Article = ({ className, title, descriptions }) => (
    <article className={classNames('account__article', className)}>
        <Text as='h4' size='xs' color='prominent' weight='bold' className='account__article-title'>
            {title}
        </Text>
        <ul className='account__article-list'>
            {descriptions &&
                descriptions.map((desc, idx) => (
                    <li key={idx}>
                        <Text as='p' size='xxs' line_height='xs'>
                            {desc}
                        </Text>
                    </li>
                ))}
        </ul>
    </article>
);

Article.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    descriptions: PropTypes.array,
};

export default Article;
