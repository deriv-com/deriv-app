import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { localize, Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { getTextSize } from 'Utils/responsive';

type TMarketRateChangeErrorModal = {
    show_confirm_continue?: boolean;
    show_message?: boolean;
    show_title?: boolean;
};

const MarketRateChangeErrorModal = ({
    show_confirm_continue,
    show_message,
    show_title,
}: TMarketRateChangeErrorModal) => {
    const { is_modal_open, hideModal } = useModalManagerContext();

    return (
        <Modal is_open={is_modal_open} onExited={hideModal} small>
            {show_title && (
                <Text weight='bold'>
                    <Localize i18n_default_text='The [IDR] market rate has changed.' />
                </Text>
            )}
            <Modal.Body>
                {show_message ? (
                    <div className='market-rate-change-error-modal__message'>
                        <Text as='p' size={getTextSize('xxs', 'xs')} line_height='s'>
                            <Localize i18n_default_text='You are creating an order to buy 0.00 USD for 0.00 IDR' />
                        </Text>
                        <Text as='p' size={getTextSize('xxs', 'xs')} line_height='s'>
                            <Localize i18n_default_text='The actual rate may differ slightly due to market fluctuations. The final rate will be shown on your order.' />
                        </Text>
                        <Text as='p' size={getTextSize('xxs', 'xs')} line_height='s'>
                            <Localize i18n_default_text='Note: if the market rate changes too much we won’t be able to process your order' />
                        </Text>
                    </div>
                ) : (
                    <Text as='p' size={getTextSize('xxs', 'xs')} line_height='s'>
                        <Localize i18n_default_text='The advertiser changed the rate before you confirmed the order.' />
                    </Text>
                )}
            </Modal.Body>
            <Modal.Footer>
                {show_confirm_continue ? (
                    <Button.Group>
                        <Button onClick={hideModal} text={localize('Cancel')} secondary large />
                        <Button onClick={hideModal} text={localize('Confirm and continue')} primary large />
                    </Button.Group>
                ) : (
                    <Button onClick={hideModal} text={localize('Try again')} primary large />
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default MarketRateChangeErrorModal;
