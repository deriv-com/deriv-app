import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { localize, Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

const AdErrorTooltipModal = () => {
    const { my_ads_store, general_store } = useStores();
    const { hideModal, is_modal_open } = useModalManagerContext();

    return (
        <Modal className='p2p-my-ads__modal-error' is_open={is_modal_open} small has_close_icon={false}>
            <Modal.Body>
                <Text as='p' color='prominent' size='xs'>
                    <Localize
                        i18n_default_text='Your ad is not listed on Buy/Sell because its minimum order is higher than your Deriv P2P available balance ({{balance}} {{currency}}).'
                        values={{
                            balance: general_store.advertiser_info.balance_available,
                            currency: my_ads_store.advert_details?.account_currency,
                        }}
                    />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button has_effect text={localize('Ok')} onClick={() => hideModal()} primary large />
            </Modal.Footer>
        </Modal>
    );
};

export default observer(AdErrorTooltipModal);
