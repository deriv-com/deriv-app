import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const ReadMore = ({ expand_text, collapse_text, text, collapse_length, className }) => {
    const [content, updateContent] = React.useState('');
    const [collapsed, toggleCollapse] = React.useState(true);

    React.useEffect(() => {
        updateContent(collapsed ? text.substring(0, collapse_length) : text);
    }, [collapsed]);

    const read_more = collapsed ? `${expand_text}` : collapse_text || '';

    return (
        <div className={classNames('dc-read-more', className)}>
            <span className='dc-read-more__content'>{content}</span>
            {collapsed && <span>...</span>}
            <span className='dc-read-more__toggle' onClick={() => toggleCollapse(!collapsed)}>
                {read_more}
            </span>
        </div>
    );
};
ReadMore.propTypes = {
    className: PropTypes.string,
    collapse_length: PropTypes.number,
    collapse_text: PropTypes.string,
    expand_text: PropTypes.string,
    text: PropTypes.string,
};

export default ReadMore;
