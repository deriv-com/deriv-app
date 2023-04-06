import React from 'react';
import {
    Button,
    Checkbox,
    Modal,
    DesktopWrapper,
    MobileWrapper,
    MobileDialog,
    Div100vhContainer,
} from '@deriv/components';
import { localize } from '@deriv/translations';
import WalletsConsentForm from './wallets-consent-form';

type TWalletsConsentPopupProps = {
    show_test_modal: boolean;
    setShowTestModal: (show_test_modal: boolean) => void;
};

const WalletsConsentPopup = ({ show_test_modal, setShowTestModal }: TWalletsConsentPopupProps) => {
    const [is_disabled, setIsDisabled] = React.useState(false);

    const toggleModal = () => {
        setShowTestModal(!show_test_modal);
    };

    const toggleCheckbox = () => {
        setIsDisabled(!is_disabled);
    };

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Modal
                    is_open={show_test_modal}
                    title={' '}
                    width='1200px'
                    height='734px'
                    toggleModal={toggleModal}
                    has_close_icon_close
                >
                    <Modal.Body className='wallet-wrapper'>
                        <div className='wallet-wrapper--body'>
                            <WalletsConsentForm />
                            <Checkbox
                                onChange={toggleCheckbox}
                                className='wallet-wrapper--checkbox'
                                label={localize('I understand and agree to upgrade to Wallets.')}
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer has_separator>
                        <Button secondary text={localize('Back')} large onClick={setShowTestModal(false)} />
                        <Button
                            primary
                            text={localize('Upgrade to Wallets')}
                            large
                            onClick={setShowTestModal(false)}
                            is_disabled={!is_disabled}
                        />
                    </Modal.Footer>
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileDialog
                    portal_element_id='modal_root'
                    wrapper_classname='wallet-wrapper'
                    visible={show_test_modal}
                    has_full_height={true}
                >
                    <Div100vhContainer className='wallet-wrapper--body' height_offset='15rem'>
                        <WalletsConsentForm />
                        <Checkbox
                            onChange={toggleCheckbox}
                            className='wallet-wrapper--checkbox'
                            label={localize('I understand and agree to upgrade to Wallets.')}
                        />
                    </Div100vhContainer>
                    <div className='wallet-wrapper--footer'>
                        <Button secondary text={localize('Back')} large className='wallet-wrapper--footer__btn' />
                        <Button
                            primary
                            text={localize('Upgrade to Wallets')}
                            large
                            className='wallet-wrapper--footer__btn'
                            is_disabled={!is_disabled}
                        />
                    </div>
                </MobileDialog>
            </MobileWrapper>
        </React.Fragment>
    );
};

export default WalletsConsentPopup;
