import React from 'react';
import { Button, Checkbox, Icon, Modal, Text } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

const ModalTitle = () => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    return (
        <React.Fragment>
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
        </React.Fragment>
    );
};
const disclaimer_statements = [
    <Localize
        i18n_default_text='If you’re selling, only release funds to the buyer after you’ve received payment.'
        key={0}
    />,
    <Localize i18n_default_text='We’ll never ask you to release funds on behalf of anyone.' key={1} />,
    <Localize
        i18n_default_text="Read the instructions in the ad carefully before making your order. If there's anything unclear, check with the advertiser first."
        key={2}
    />,
    <Localize
        i18n_default_text='Only discuss your P2P order details within the in-app chatbox, and nowhere else.'
        key={3}
    />,
    <Localize i18n_default_text='All P2P transactions are final and cannot be reversed.' key={4} />,
];

type TDisclaimerModalProps = {
    handleDisclaimerTimeout: (time_left: number) => void;
};

const DisclaimerModal = ({ handleDisclaimerTimeout }: TDisclaimerModalProps) => {
    const [is_checked, setIsChecked] = React.useState(false);
    const { hideModal, is_modal_open } = useModalManagerContext();
    const { client, ui } = useStore();
    const { loginid } = client;
    const { is_mobile } = ui;

    const onClickConfirm = () => {
        const current_date = new Date().toISOString();
        localStorage.setItem(`p2p_${loginid}_disclaimer_shown`, current_date);
        hideModal();
        handleDisclaimerTimeout(0);
    };

    const onToggleCheckbox = React.useCallback(() => {
        setIsChecked(prev_state => !prev_state);
    }, []);

    return (
        <Modal
            className='disclaimer-modal'
            is_open={is_modal_open}
            small
            has_close_icon={false}
            title={<ModalTitle />}
            is_title_centered
        >
            <Modal.Body className='disclaimer-modal__body'>
                <ul className='disclaimer-modal__body-list'>
                    {disclaimer_statements.map((statement, idx) => (
                        <li key={idx}>
                            <Text line_height={is_mobile ? 'l' : 'xl'} size={is_mobile ? 'xxs' : 'xs'}>
                                {statement}
                            </Text>
                        </li>
                    ))}
                </ul>
                <Checkbox
                    onChange={onToggleCheckbox}
                    name='disclaimer-checkbox'
                    value={is_checked}
                    label={
                        <Text line_height={is_mobile ? 'l' : 'xl'} size={is_mobile ? 'xxs' : 'xs'}>
                            <Localize i18n_default_text='I’ve read and understood the above reminder.' />
                        </Text>
                    }
                />
            </Modal.Body>
            <Modal.Footer>
                <Button has_effect onClick={onClickConfirm} primary large disabled={!is_checked}>
                    <Localize i18n_default_text='Confirm' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DisclaimerModal;
