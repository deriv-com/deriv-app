import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Popover from '../popover';
import Icon from '../icon';

const Clipboard = ({ text_copy, info_message, success_message, className, popoverClassName }) => {
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
            <Popover
                alignment='bottom'
                classNameBubble={classNames('dc-clipboard__popover', popoverClassName)}
                message={is_copied ? success_message : info_message}
                relative_render
            >
                {is_copied && (
                    <Icon
                        icon='IcCheckmarkCircle'
                        custom_color='var(--status-success)'
                        className={classNames('dc-clipboard', className)}
                    />
                )}
                {!is_copied && (
                    <Icon
                        icon='IcClipboard'
                        custom_color='var(--text-less-prominent)'
                        className={classNames('dc-clipboard', className)}
                        onClick={onClick}
                    />
                )}
            </Popover>
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
