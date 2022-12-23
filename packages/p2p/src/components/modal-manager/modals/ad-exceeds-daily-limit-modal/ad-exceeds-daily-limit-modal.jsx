import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { localize, Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

const AdExceedsDailyLimitModal = () => {
    const { my_ads_store } = useStores();
    const { hideModal, is_modal_open } = useModalManagerContext();

    return (
        <Modal
            className='p2p-my-ads__modal-error'
            is_open={is_modal_open}
            small
            has_close_icon={false}
            title={localize('Your ad exceeds the daily limit')}
        >
            <Modal.Body>
                <Text as='p' color='prominent' size='xs'>
                    <Localize
                        i18n_default_text='Your ad is not listed on <0>Buy/Sell</0> because the amount exceeds your daily limit of {{limit}} {{currency}}.
                        <1 /><1 />You can still see your ad on <0>My ads</0>. If you’d like to increase your daily limit, please contact us via <2>live chat</2>.'
                        values={{
                            limit: my_ads_store.advert_details?.max_order_amount_limit_display,
                            currency: my_ads_store.advert_details?.account_currency,
                        }}
                        components={[
                            <Text key={0} size='xs' weight='bold' />,
                            <br key={1} />,
                            <span
                                key={2}
                                className='link link--orange'
                                onClick={() => window.LC_API.open_chat_window()}
                            />,
                        ]}
                    />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button has_effect text={localize('Ok')} onClick={() => hideModal()} primary large />
            </Modal.Footer>
        </Modal>
    );
};

export default observer(AdExceedsDailyLimitModal);
