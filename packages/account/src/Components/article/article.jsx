import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Text } from '@deriv/components';

const Article = ({ className, title, descriptions }) => (
    <article className={classNames('account__article', className)}>
        <h4 className='account__article-title'>{title}</h4>
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
