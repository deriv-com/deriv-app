import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';

type TOpenPositionsSVGModal = {
    market_type: string;
    open_order_position_status: boolean;
    is_modal_open: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const OpenPositionsSVGModal = ({
    market_type,
    open_order_position_status,
    is_modal_open,
    setModalOpen,
}: TOpenPositionsSVGModal) => {
    const onClick = () => {
        setModalOpen(false);
    };
    const title = open_order_position_status ? 'No new positions' : 'Account closed';
    const content = open_order_position_status
        ? 'You can no longer open new positions with your MT5 {{account_type}} SVG account. Please use your MT5 {{account_type}} BVI account to open new positions.'
        : 'Your MT5 {{account_type}} SVG account will be archived after 30 days of inactivity. You can still access your trade history until the account is archived.';
    const account_type = market_type === 'financial' ? 'Financial' : 'Derived';

    return (
        <Modal
            is_open={is_modal_open}
            toggleModal={() => setModalOpen(is_modal_open => !is_modal_open)}
            small
            has_close_icon={false}
        >
            <Modal.Body>
                <Text as='h1' color='prominent' weight='bold' className='open-positions-svg__modal-title'>
                    <Localize i18n_default_text='{{title}}' values={{ title }} />
                </Text>
                <Text as='p' color='prominent ' size='xs' line_height='m'>
                    <Localize i18n_default_text='{{content}}' values={{ account_type, content }} />
                </Text>
            </Modal.Body>
            <Modal.Footer className='open-positions-svg__modal-footer'>
                <Button has_effect text={localize('OK')} onClick={onClick} secondary large />
            </Modal.Footer>
        </Modal>
    );
};

export default OpenPositionsSVGModal;
