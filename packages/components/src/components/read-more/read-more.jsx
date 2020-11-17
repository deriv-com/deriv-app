import React from 'react';
import classNames from 'classnames';

const ReadMore = ({
    extend_text,
    collapse_text = '',
    text = '',
    collapse_length = 50,
    className = '',
    text_props = {},
}) => {
    const [content, updateContent] = React.useState('');
    const [collapsed, toggleCollapse] = React.useState(true);
    React.useEffect(() => {
        updateContentHandler();
    }, [collapsed]);
    const updateContentHandler = () => {
        updateContent(collapsed ? text.substring(0, collapse_length) : text);
    };
    const read_more = collapsed ? `...${extend_text}` : collapse_text;
    return (
        <div {...text_props} className={classNames('dc-read-more', className)}>
            <span className='dc-read-more__content'>{content}</span>
            <span className='dc-read-more__toggle' onClick={() => toggleCollapse(!collapsed)}>
                {read_more}
            </span>
        </div>
    );
};

export default ReadMore;
