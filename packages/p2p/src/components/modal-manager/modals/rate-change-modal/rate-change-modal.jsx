import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { localize, Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { getTextSize } from 'Utils/responsive';
import './rate-change-modal.scss';

const RateChangeModal = ({ currency }) => {
    const {
        client: { local_currency_config },
    } = useStore();

    const local_currency = currency ?? local_currency_config?.currency;
    const { hideModal, is_modal_open } = useModalManagerContext();

    return (
        <Modal is_open={is_modal_open} toggleModal={hideModal} small className='rate-change-modal'>
            <Modal.Body>
                <Text
                    as='p'
                    align='left'
                    className='rate-change-modal__message'
                    size={getTextSize('xxs', 'xs')}
                    line_height='s'
                >
                    <Localize
                        i18n_default_text={'The {{local_currency}} market rate has changed.'}
                        values={{ local_currency }}
                    />
                </Text>
            </Modal.Body>
            <Modal.Footer className='rate-change-modal__button'>
                <Button onClick={hideModal} text={localize('Try again')} primary large />
            </Modal.Footer>
        </Modal>
    );
};

export default observer(RateChangeModal);
