import React from 'react';
import { Button, Checkbox, Icon, Modal, Text } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

const DisclaimerModal = () => {
    const [is_checked, setIsChecked] = React.useState<boolean>(false);
    const { hideModal, is_modal_open } = useModalManagerContext();
    const { client, ui } = useStore();
    const { loginid } = client;
    const { is_mobile } = ui;

    const onClickConfirm = () => {
        const current_date = new Date().toISOString();
        localStorage.setItem(`${loginid}_disclaimer_shown`, current_date);
        hideModal();
    };

    return (
        <Modal className='disclaimer-modal' is_open={is_modal_open} small has_close_icon={false}>
            <Modal.Body className='disclaimer-modal__body'>
                <React.Fragment>
                    <div className='disclaimer-modal__body-title'>
                        <Icon icon='IcWarning' size={64} className='disclaimer-modal__body-icon' />
                        <Text
                            as='p'
                            color='prominent'
                            weight='bold'
                            line_height={is_mobile ? 'xl' : 'xxl'}
                            size={is_mobile ? 'xs' : 's'}
                        >
                            <Localize i18n_default_text='For your safety:' />
                        </Text>
                    </div>
                    <Text
                        as='div'
                        line_height={is_mobile ? 'l' : 'xl'}
                        size={is_mobile ? 'xxs' : 'xs'}
                        className='disclaimer-modal__body-bullets'
                    >
                        <ul>
                            <li>
                                <Localize i18n_default_text='If you’re selling, only release funds to the buyer after you’ve received payment.' />
                            </li>
                            <li>
                                <Localize i18n_default_text='We’ll never ask you to release funds on behalf of anyone.' />
                            </li>
                            <li>
                                <Localize i18n_default_text="Read the instructions in the ad carefully before making your order. If there's anything unclear, check with the advertiser first." />
                            </li>
                            <li>
                                <Localize i18n_default_text='Only discuss your P2P order details within the in-app chatbox, and nowhere else.' />
                            </li>
                            <li>
                                <Localize i18n_default_text='All P2P transactions are final and cannot be reversed.' />
                            </li>
                        </ul>
                    </Text>
                    <Checkbox
                        onChange={() => setIsChecked(!is_checked)}
                        name='disclaimer-checkbox'
                        value={is_checked}
                        label={
                            <Text line_height={is_mobile ? 'l' : 'xl'} size={is_mobile ? 'xxs' : 'xs'}>
                                <Localize i18n_default_text='I’ve read and understood the above reminder.' />
                            </Text>
                        }
                    />
                </React.Fragment>
            </Modal.Body>
            <Modal.Footer className='disclaimer-modal__footer'>
                <Button has_effect onClick={onClickConfirm} primary large disabled={!is_checked}>
                    <Localize i18n_default_text='Confirm' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DisclaimerModal;
