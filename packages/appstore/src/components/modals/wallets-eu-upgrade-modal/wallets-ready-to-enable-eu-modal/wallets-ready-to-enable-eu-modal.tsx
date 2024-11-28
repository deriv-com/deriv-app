import React, { useMemo } from 'react';

import { Button, Icon, MobileDialog, Modal, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { SectionMessage } from '@deriv-com/ui';

import './wallets-ready-to-enable-eu-modal.scss';

type TProps = {
    is_open: boolean;
    onClickHandler: () => void;
};

type TWalletsReadyToEnableEuModalBody = {
    is_desktop?: boolean;
};

const WalletsReadyToEnableEuModalBody: React.FC<TWalletsReadyToEnableEuModalBody> = ({ is_desktop = true }) => {
    return (
        <>
            <div className='wallets-ready-to-enable-eu-modal__icon'>
                <Icon
                    icon='IcAppstoreWalletsUpgradeStepTwo'
                    height={is_desktop ? 272 : 170}
                    width={is_desktop ? 240 : 150}
                />
            </div>
            <div className='wallets-ready-to-enable-eu-modal__content'>
                <Text as='p' align='center' size={is_desktop ? 'l' : 'xsm'} weight='bold'>
                    <Localize i18n_default_text='Ready to enable Wallets' />
                </Text>
                <Text as='p' align='center' size={is_desktop ? 's' : 'xs'}>
                    <Localize i18n_default_text='Wallets will become your dedicated fund management tool, allowing you to transfer funds between your Wallet and trading accounts instantly.' />
                </Text>
            </div>
            <SectionMessage variant='info' className='wallets-ready-to-enable-eu-modal__disclaimer'>
                <Text size={is_desktop ? 'xs' : 'xxs'}>
                    <Localize i18n_default_text='Your open trading positions will not be affected while we are setting up your wallets.' />
                </Text>
            </SectionMessage>
        </>
    );
};

const WalletsReadyToEnableEuModal: React.FC<TProps> = observer(({ is_open, onClickHandler }) => {
    const { ui } = useStore();
    const { is_desktop } = ui;

    const enableButton = useMemo(() => {
        return (
            <Button
                wrapperClassName='wallets-ready-to-enable-eu-modal__button'
                large={is_desktop}
                onClick={onClickHandler}
                primary
                text={localize('Enable')}
                type='button'
            />
        );
    }, [is_desktop, onClickHandler]);

    if (!is_desktop) {
        return (
            <MobileDialog
                visible={is_open}
                portal_element_id='modal_root'
                has_close_icon={false}
                footer={enableButton}
                header_classname='wallets-ready-to-enable-eu-modal__responsive-header'
                footer_classname='wallets-ready-to-enable-eu-modal__responsive-footer'
            >
                <div className='wallets-ready-to-enable-eu-modal__body'>
                    <WalletsReadyToEnableEuModalBody is_desktop={false} />
                </div>
            </MobileDialog>
        );
    }

    return (
        <Modal
            className='wallets-ready-to-enable-eu-modal'
            is_open={is_open}
            height='auto'
            width='93.6rem'
            has_close_icon={false}
        >
            <Modal.Body className='wallets-ready-to-enable-eu-modal__body'>
                <WalletsReadyToEnableEuModalBody is_desktop />
            </Modal.Body>
            <Modal.Footer className='wallets-ready-to-enable-eu-modal__footer'>{enableButton}</Modal.Footer>
        </Modal>
    );
});

export default WalletsReadyToEnableEuModal;
