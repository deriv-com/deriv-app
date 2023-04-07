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
    show_wallet_consent_popup: boolean;
    setShouldShowWalletConsentPopup: (show_wallet_consent_popup: boolean) => void;
    is_eu: boolean;
    is_high_risk: boolean;
};

const WalletsConsentPopup = ({
    show_wallet_consent_popup,
    setShouldShowWalletConsentPopup,
    is_eu,
    is_high_risk,
}: TWalletsConsentPopupProps) => {
    const [is_disabled, setIsDisabled] = React.useState(false);

    const toggleModal = () => {
        setShouldShowWalletConsentPopup(!show_wallet_consent_popup);
    };

    const toggleCheckbox = () => {
        setIsDisabled(!is_disabled);
    };

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Modal
                    is_open={show_wallet_consent_popup}
                    title={' '}
                    width='1200px'
                    height='734px'
                    toggleModal={toggleModal}
                    has_close_icon_close
                >
                    <Modal.Body className='wallet-wrapper'>
                        <div className='wallet-wrapper--body'>
                            <WalletsConsentForm is_eu={is_eu} is_high_risk={is_high_risk} />
                            <Checkbox
                                onChange={toggleCheckbox}
                                className='wallet-wrapper--checkbox'
                                label={localize('I understand and agree to upgrade to Wallets.')}
                            />
                        </div>
                    </Modal.Body>
                    {/* TODO: Once merged with the main component the button will not be needed as it will be handled on the main component */}
                    <Modal.Footer has_separator>
                        <Button
                            secondary
                            text={localize('Back')}
                            large
                            onClick={setShouldShowWalletConsentPopup(false)}
                        />
                        <Button
                            primary
                            text={localize('Upgrade to Wallets')}
                            large
                            onClick={setShouldShowWalletConsentPopup(false)}
                            is_disabled={!is_disabled}
                        />
                    </Modal.Footer>
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileDialog
                    portal_element_id='modal_root'
                    wrapper_classname='wallet-wrapper'
                    visible={show_wallet_consent_popup}
                    has_full_height={true}
                >
                    <Div100vhContainer className='wallet-wrapper--body' height_offset='15rem'>
                        <WalletsConsentForm is_eu={is_eu} />
                        <Checkbox
                            onChange={toggleCheckbox}
                            className='wallet-wrapper--checkbox'
                            label={localize('I understand and agree to upgrade to Wallets.')}
                        />
                    </Div100vhContainer>
                    {/* TODO: Once merged with the main component the button will not be needed as it will be handled on the main component */}
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
