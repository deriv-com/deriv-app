import React from 'react';

import { Button, Modal, StaticUrl, Text } from '@deriv/components';
import { WS } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { Chat } from '@deriv/utils';
import { useDevice } from '@deriv-com/ui';

import './tnc-status-update-modal.scss';

const TncStatusUpdateModal = observer(() => {
    const { client, ui } = useStore();
    const { is_cr_account } = client;
    const { is_tnc_update_modal_open, toggleTncUpdateModal } = ui;
    const { isDesktop } = useDevice();

    const onClick = async () => {
        await WS.tncApproval();
        WS.getSettings();
        toggleTncUpdateModal(false);
    };

    return (
        <Modal
            className='tnc-status-update-modal-wrapper'
            is_open={is_tnc_update_modal_open}
            has_close_icon={false}
            width='44rem'
        >
            <div className='tnc-status-update-modal'>
                <Text size={isDesktop ? 's' : 'xs'} weight='bold'>
                    <Localize i18n_default_text='Accept updated terms and conditions' />
                </Text>
                <div className='tnc-status-update-modal__text-container'>
                    <Text size={isDesktop ? 'xs' : 'xxs'}>
                        <Localize
                            i18n_default_text='To continue trading, review and accept our updated <0>terms and conditions</0>. Not accepting will lead to restricted access to your account. Need help? Contact us via <1>live chat</1>.'
                            components={[
                                <StaticUrl
                                    key={0}
                                    className='link'
                                    href='terms-and-conditions'
                                    is_eu_url={!is_cr_account}
                                />,
                                <a
                                    key={1}
                                    className='link'
                                    rel='noopener noreferrer'
                                    target='_blank'
                                    onClick={Chat.open}
                                />,
                            ]}
                        />
                    </Text>
                </div>
                <div className='tnc-status-update-modal__button'>
                    <Button className='dc-dialog__button' has_effect onClick={onClick} primary large>
                        <Localize i18n_default_text='Accept now' />
                    </Button>
                </div>
            </div>
        </Modal>
    );
});

export default TncStatusUpdateModal;
