import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { useP2PSettings } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { ad_type } from 'Constants/floating-rate';
import { useStores } from 'Stores';

type TMyAdsFloatingRateSwitchModalProps = {
    onSwitch?: () => void;
};

const MyAdsFloatingRateSwitchModal = ({ onSwitch }: TMyAdsFloatingRateSwitchModalProps) => {
    const {
        ui: { is_desktop },
    } = useStore();
    const { my_ads_store } = useStores();
    const { hideModal, is_modal_open } = useModalManagerContext();
    const { selected_ad_type, toggleMyAdsRateSwitchModal } = my_ads_store;
    const { p2p_settings } = useP2PSettings();
    const is_float_rate = p2p_settings?.rate_type === ad_type.FLOAT;

    return (
        <Modal is_open={is_modal_open} toggleModal={hideModal} small className='my-ads-floating-rate-switch-modal'>
            <Modal.Body>
                <Text size={is_desktop ? 's' : 'xs'}>
                    {is_float_rate ? (
                        <Localize i18n_default_text='Set a floating rate for your ad.' />
                    ) : (
                        <Localize i18n_default_text='Set a fixed rate for your ad.' />
                    )}
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button.Group>
                    <Button
                        className='my-ads-floating-rate-switch-modal__cancel-button'
                        secondary
                        type='button'
                        onClick={() => toggleMyAdsRateSwitchModal(selected_ad_type, false)}
                        large
                    >
                        <Localize i18n_default_text='Cancel' />
                    </Button>
                    <Button
                        primary
                        large
                        onClick={() => {
                            if (onSwitch) onSwitch();
                            else toggleMyAdsRateSwitchModal(p2p_settings?.rate_type, true);
                        }}
                    >
                        {is_float_rate ? (
                            <Localize i18n_default_text='Set floating rate' />
                        ) : (
                            <Localize i18n_default_text='Set fixed rate' />
                        )}
                    </Button>
                </Button.Group>
            </Modal.Footer>
        </Modal>
    );
};

export default observer(MyAdsFloatingRateSwitchModal);
