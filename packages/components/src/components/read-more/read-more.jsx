import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const ReadMore = ({ className, collapse_length, expand_text, openDialog, text }) => {
    const [content, updateContent] = React.useState('');
    const [is_collapsed, setIsCollapsed] = React.useState(true);

    React.useEffect(() => {
        const collapse_text = text.substring(0, collapse_length);
        openDialog ? updateContent(collapse_text) : updateContent(is_collapsed ? collapse_text : text);
    }, [is_collapsed]);

    return (
        <React.Fragment>
            {openDialog && (
                <div className={classNames('dc-read-more', className)}>
                    <span className='dc-read-more__content'>{content}</span>
                    <span>...</span>
                    <span className='dc-read-more__dialog' onClick={() => openDialog()}>
                        {expand_text}
                    </span>
                </div>
            )}
            {!openDialog && (
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
            )}
        </React.Fragment>
    );
};
ReadMore.propTypes = {
    className: PropTypes.string,
    collapse_length: PropTypes.number,
    collapse_text: PropTypes.string,
    expand_text: PropTypes.string,
    openDialog: PropTypes.func,
    text: PropTypes.string,
};

export default ReadMore;
