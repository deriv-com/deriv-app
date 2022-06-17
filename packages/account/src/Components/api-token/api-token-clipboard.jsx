import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useIsMounted } from '@deriv/shared';
import { Dialog, Icon, Text, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';

const WarningNoteBullet = ({ message }) => (
    <div className='da-api-token__bullet-wrapper'>
        <div className='da-api-token__bullet' />
        <Text as='p' color='prominent ' size='xs' line_height='m'>
            {message}
        </Text>
    </div>
);

const WarningDialogMessage = () => (
    <div>
        <Text as='p' color='prominent ' size='xs' line_height='m'>
            {localize(
                'Be careful who you share this token with. Anyone with this token can perform the following actions on your account behalf'
            )}
        </Text>
        <div className='da-api-token__bullet-container'>
            <WarningNoteBullet message={localize('Add accounts')} />
            <WarningNoteBullet message={localize('Create or delete API tokens for trading and withdrawals')} />
            <WarningNoteBullet message={localize('Modify account settings')} />
        </div>
    </div>
);

const ApiTokenClipboard = ({
    text_copy,
    info_message,
    icon,
    success_message,
    className,
    popoverClassName,
    popover_props = {},
    popoverAlignment = 'bottom',
}) => {
    const [is_copied, setIsCopied] = React.useState(false);
    const [is_visible, setIsVisible] = React.useState(false);
    const [is_popover_open, setIsPopoverOpen] = React.useState(false);
    const isMounted = useIsMounted();
    let timeout_clipboard = null;

    const toggleDialogVisibility = event => {
        setIsVisible(!is_visible);
        event.stopPropagation();
    };

    const togglePopupvisibility = () => {
        setIsPopoverOpen(!is_popover_open);
    };

    const copyToClipboard = text => {
        const textField = document.createElement('textarea');
        textField.innerText = text;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy');
        textField.remove();
    };

    const onClick = () => {
        setIsVisible(false);
        copyToClipboard(text_copy);
        setIsCopied(true);
        setIsPopoverOpen(true);
        timeout_clipboard = setTimeout(() => {
            if (isMounted()) {
                setIsPopoverOpen(false);
                setIsCopied(false);
            }
        }, 2000);
    };

    React.useEffect(() => {
        return () => clearTimeout(timeout_clipboard);
    }, [timeout_clipboard]);

    return (
        <>
            <Dialog
                is_visible={is_visible}
                confirm_button_text={localize('Ok')}
                onConfirm={onClick}
                className='da-api-token__dialog'
            >
                <WarningDialogMessage />
            </Dialog>
            <Popover
                alignment={popoverAlignment}
                classNameBubble={classNames('dc-clipboard__popover', popoverClassName)}
                message={is_copied ? success_message : info_message}
                is_open={is_popover_open}
                {...popover_props}
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
                        icon={icon || 'IcClipboard'}
                        custom_color='var(--text-less-prominent)'
                        className={classNames('dc-clipboard', className)}
                        onClick={toggleDialogVisibility}
                        onMouseEnter={togglePopupvisibility}
                        onMouseLeave={togglePopupvisibility}
                    />
                )}
            </Popover>
        </>
    );
};
ApiTokenClipboard.propTypes = {
    text_copy: PropTypes.string,
    icon: PropTypes.string,
    info_message: PropTypes.string,
    success_message: PropTypes.string,
    className: PropTypes.string,
    popoverClassName: PropTypes.string,
    popoverAlignment: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
};
export default ApiTokenClipboard;
