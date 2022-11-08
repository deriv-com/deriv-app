import React from 'react';
import PropTypes from 'prop-types';
import { useIsMounted } from '@deriv/shared';
import { Button, Icon, Modal, Text, Popover, useCopyToClipboard } from '@deriv/components';
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
    <>
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
    </>
);

const ApiTokenClipboard = ({ scopes, text_copy, info_message, success_message, popover_alignment = 'bottom' }) => {
    const [is_copied, copyToClipboard, setIsCopied] = useCopyToClipboard();
    const [is_modal_open, setIsModalOpen] = React.useState(false);
    const [is_popover_open, setIsPopoverOpen] = React.useState(false);
    const isMounted = useIsMounted();
    let timeout_clipboard = null;
    let timeout_clipboard_2 = null;
    const has_admin_scope = scopes.includes('Admin');

    const onMouseEnterHandler = () => {
        if (!is_copied) setIsPopoverOpen(true);
    };

    const onMouseLeaveHandler = () => {
        if (!is_copied) setIsPopoverOpen(false);
    };

    /* two timeouts help to prevent popup window blinking. 
    without early hiding the popup we will see shortly the description message like during hovering. 
    this bug appears when popup is handled outside like here
    */
    const onClick = () => {
        setIsModalOpen(false);
        copyToClipboard(text_copy);
        setIsPopoverOpen(true);
        timeout_clipboard = setTimeout(() => {
            if (isMounted()) {
                setIsPopoverOpen(false);
                setIsCopied(false);
            }
        }, 1900);
        timeout_clipboard_2 = setTimeout(() => {
            if (isMounted()) {
                setIsCopied(false);
            }
        }, 2050);
    };

    const onClickHandler = () => {
        if (has_admin_scope) {
            setIsModalOpen(true);
        } else onClick();
    };

    React.useEffect(() => {
        return () => {
            clearTimeout(timeout_clipboard);
            clearTimeout(timeout_clipboard_2);
        };
    }, [timeout_clipboard, timeout_clipboard_2]);

    return (
        <>
            <Modal is_open={is_modal_open} small>
                <Modal.Body>
                    <WarningDialogMessage />
                </Modal.Body>
                <Modal.Footer className='da-api-token__modal-footer'>
                    <Button
                        className='dc-dialog__button'
                        has_effect
                        text={localize('OK')}
                        onClick={onClick}
                        primary
                        large
                    />
                </Modal.Footer>
            </Modal>
            <Popover
                alignment={popover_alignment}
                classNameBubble='dc-clipboard__popover'
                message={is_copied ? success_message : info_message}
                is_open={is_popover_open}
                zIndex={9999}
            >
                <Icon
                    icon={`${is_copied ? 'IcCheckmarkCircle' : 'IcClipboard'}`}
                    custom_color={`${is_copied ? 'var(--status-success)' : 'var(--text-prominent)'}`}
                    className='dc-clipboard'
                    size={14}
                    data_testid={`${is_copied ? 'dt_token_copied_icon' : 'dt_copy_token_icon'}`}
                    onClick={onClickHandler}
                    onMouseEnter={onMouseEnterHandler}
                    onMouseLeave={onMouseLeaveHandler}
                />
            </Popover>
        </>
    );
};

ApiTokenClipboard.propTypes = {
    scopes: PropTypes.array.isRequired,
    text_copy: PropTypes.string,
    info_message: PropTypes.string,
    success_message: PropTypes.string,
    popover_alignment: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
};

export default ApiTokenClipboard;
