import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Popover from '../popover';
import Icon from '../icon';

const Clipboard = ({
    text_copy,
    info_message,
    success_message,
    className,
    popoverClassName,
    custom_colour_icon_copy,
    custom_colour_icon_success,
    onClickCopy,
}) => {
    const [is_copied, setIsCopied] = React.useState(false);
    let timeout_clipboard = null;

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
        timeout_clipboard = setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    React.useEffect(() => {
        return () => clearTimeout(timeout_clipboard);
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
                    <Icon
                        icon='IcClipboard'
                        custom_color={custom_colour_icon_copy || 'var(--text-less-prominent)'}
                        className={classNames('dc-clipboard', className)}
                        onClick={() => {
                            onClick();
                            if (typeof onClickCopy === 'function') {
                                onClickCopy();
                            }
                        }}
                    />
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
                    <Icon
                        icon='IcCheckmarkCircle'
                        custom_color={custom_colour_icon_success || 'var(--status-success)'}
                        className={classNames('dc-clipboard', className)}
                    />
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
