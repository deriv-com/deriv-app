import React from 'react';
import { Localize } from 'Components/i18next';
import { Button, Modal } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { ad_type } from 'Constants/floating-rate';
import { useStores } from 'Stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

const MyAdsFloatingRateSwitchModal = () => {
    const { floating_rate_store, my_ads_store } = useStores();
    const { is_modal_open } = useModalManagerContext();

    return (
        <React.Fragment>
            <Modal
                is_open={is_modal_open}
                toggleModal={() => my_ads_store.toggleMyAdsRateSwitchModal(my_ads_store.selected_ad_type)}
                small
                className='switch-ads'
            >
                <Modal.Body>
                    {floating_rate_store.rate_type === ad_type.FLOAT ? (
                        <Localize i18n_default_text='Set a floating rate for your ad.' />
                    ) : (
                        <Localize i18n_default_text='Set a fixed rate for your ad.' />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button.Group>
                        <Button
                            secondary
                            type='button'
                            onClick={() =>
                                my_ads_store.toggleMyAdsRateSwitchModal(
                                    my_ads_store.selected_ad_type,
                                    !floating_rate_store.reached_target_date
                                )
                            }
                            large
                        >
                            <Localize
                                i18n_default_text={
                                    floating_rate_store.reached_target_date ? 'Cancel' : "I'll do this later"
                                }
                            />
                        </Button>
                        <Button
                            primary
                            large
                            onClick={() => my_ads_store.toggleMyAdsRateSwitchModal(floating_rate_store.rate_type, true)}
                        >
                            {floating_rate_store.rate_type === ad_type.FLOAT ? (
                                <Localize i18n_default_text='Set floating rate' />
                            ) : (
                                <Localize i18n_default_text='Set fixed rate' />
                            )}
                        </Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default observer(MyAdsFloatingRateSwitchModal);
