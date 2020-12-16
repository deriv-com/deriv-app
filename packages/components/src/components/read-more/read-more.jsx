import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const ReadMore = ({ expand_text, text, collapse_length, className }) => {
    const [content, updateContent] = React.useState('');
    const [is_collapsed, setIsCollapsed] = React.useState(true);

    React.useEffect(() => {
        updateContent(is_collapsed ? text.substring(0, collapse_length) : text);
    }, [is_collapsed]);

    return (
        <div
            className={classNames('dc-read-more', className)}
            onClick={is_collapsed ? undefined : () => setIsCollapsed(true)}
        >
            <span className='dc-read-more__content'>{content}</span>
            {is_collapsed && (
                <React.Fragment>
                    <span>...</span>
                    <span className='dc-read-more__toggle' onClick={() => setIsCollapsed(false)}>
                        {expand_text}
                    </span>
                </React.Fragment>
            )}
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
