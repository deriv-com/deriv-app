import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const Article = ({ className, title, descriptions }) => (
    <article className={classNames('account__article', className)}>
        <h4 className='account__article-title'>{title}</h4>
        <ul className='account__article-list'>
            {descriptions &&
                descriptions.map((desc, idx) => (
                    <li key={idx}>
                        <p className='account__article-text'>{desc}</p>
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
