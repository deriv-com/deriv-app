import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Popover from '../popover';
import Icon from '../icon';

const Clipboard = ({ text_copy, info_message, success_message, className, popoverClassName }) => {
    const [is_copied, setIsCopied] = React.useState(false);
    let copy_timeout = null;

    const copyToClipboard = text => {
        const textField = document.createElement('textarea');
        textField.innerText = text;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy');
        textField.remove();
    };

    const onClick = () => {
        copyToClipboard(text_copy);
        setIsCopied(true);
        copy_timeout = setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    React.useEffect(() => {
        return () => {
            clearTimeout(copy_timeout);
        };
    }, []);

    return (
        <>
            {!is_copied && (
                <Popover
                    alignment='bottom'
                    classNameBubble={classNames('dc-clipboard__popover', popoverClassName)}
                    is_bubble_hover_enabled
                    message={info_message}
                >
                    <Icon icon='IcClipboard' className={classNames('dc-clipboard', className)} onClick={onClick} />
                </Popover>
            )}
            {is_copied && (
                <Popover
                    alignment='bottom'
                    classNameBubble={classNames('dc-clipboard__popover', popoverClassName)}
                    is_bubble_hover_enabled
                    message={success_message}
                    relative_render
                >
                    <Icon icon='IcCheckmarkOutline' className={classNames('dc-clipboard', className)} />
                </Popover>
            )}
        </>
    );
};
Clipboard.propTypes = {
    text_copy: PropTypes.string,
    info_message: PropTypes.string,
    success_message: PropTypes.string,
    className: PropTypes.string,
    popoverClassName: PropTypes.string,
};
export default Clipboard;
