import PropTypes from 'prop-types';
import React from 'react';
import { Button, HintBox, Icon, Loading, Popover } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { website_name } from '@deriv/shared';
import { connect } from 'Stores/connect';

const OnRampProviderPopup = ({
    api_error,
    deposit_address,
    is_deposit_address_loading,
    is_deposit_address_popover_open,
    onClickCopyDepositAddress,
    onClickDisclaimerContinue,
    onClickGoToDepositPage,
    selected_provider,
    setDepositAddressRef,
    setIsOnRampModalOpen,
    should_show_dialog,
    should_show_widget,
}) => {
    if (selected_provider === null) {
        return null;
    }
    if (is_deposit_address_loading) {
        return <Loading is_fullscreen={false} />;
    }
    if (should_show_widget) {
        return (
            <div className='on-ramp__widget-container'>
                <div dangerouslySetInnerHTML={{ __html: selected_provider.getWidgetHtml() }} />
            </div>
        );
    }
    if (should_show_dialog) {
        return (
            <div className='on-ramp__popup-no-deposit-address'>
                <div className='on-ramp__popup-no-deposit-address-text'>
                    {api_error ? (
                        <Localize i18n_default_text='Please go to the Deposit page to get an address.' />
                    ) : (
                        <Localize i18n_default_text='Please go to the Deposit page to generate an address. Then come back here to continue with your transaction.' />
                    )}
                </div>
                <Button.Group className='on-ramp__popup-no-deposit-address-buttons'>
                    <Button text={localize('Cancel')} onClick={() => setIsOnRampModalOpen(false)} secondary large />
                    <Button text={localize('Go to Deposit page')} onClick={onClickGoToDepositPage} primary large />
                </Button.Group>
            </div>
        );
    }
    return (
        <div className='on-ramp__popup'>
            <div className='on-ramp__popup-deposit'>
                <div className='on-ramp__popup-deposit-intro'>
                    <Localize i18n_default_text="Please copy the crypto address you see below. You'll need it to deposit your cryptocurrency." />
                </div>
                <div className='on-ramp__popup-deposit-address'>
                    <Popover
                        zIndex={9998}
                        alignment='right'
                        message={localize('Copied!')}
                        is_open={is_deposit_address_popover_open}
                    >
                        <span
                            className='on-ramp__popup-deposit-address-text'
                            onClick={onClickCopyDepositAddress}
                            ref={setDepositAddressRef}
                        >
                            {deposit_address}
                        </span>
                        <Icon
                            className='on-ramp__popup-deposit-address-icon'
                            icon='IcClipboard'
                            size={16}
                            onClick={onClickCopyDepositAddress}
                        />
                    </Popover>
                </div>
                <div className='on-ramp__popup-deposit-address-hint'>
                    <HintBox
                        icon={'IcInfo'}
                        is_info
                        message={localize(
                            'This address can only be used ONCE. Please copy a new one for your next transaction.'
                        )}
                    />
                </div>
            </div>
            <div className='on-ramp__popup-divider' />
            <div className='on-ramp__popup-disclaimer'>
                <h2 className='on-ramp__popup-disclaimer-title'>
                    <Localize i18n_default_text='Disclaimer' />
                </h2>
                <div className='on-ramp__popup-disclaimer-text'>
                    <Localize
                        i18n_default_text="Please note that by clicking 'Continue', you'll leave {{ website_name }}. Your payment will be processed by {{ service }}, a third-party payment service provider. We are not liable for {{ service }}'s security or performance."
                        values={{ service: selected_provider.name, website_name }}
                    />
                </div>
            </div>
            {!should_show_widget && deposit_address && (
                <div className='on-ramp__popup-buttons'>
                    <Button.Group>
                        <Button large onClick={() => setIsOnRampModalOpen(false)} secondary text={localize('Cancel')} />
                        <Button
                            id={`gtm-onramp-provider-continue--${selected_provider.name
                                .toLowerCase()
                                .replace(' ', '-')}`}
                            large
                            onClick={onClickDisclaimerContinue}
                            primary
                            text={localize('Continue')}
                        />
                    </Button.Group>
                </div>
            )}
        </div>
    );
};

OnRampProviderPopup.propTypes = {
    api_error: PropTypes.string,
    deposit_address: PropTypes.string,
    is_deposit_address_loading: PropTypes.bool,
    is_deposit_address_popover_open: PropTypes.bool,
    selected_provider: PropTypes.object,
    setDepositAddressRef: PropTypes.func,
    setIsOnRampModalOpen: PropTypes.func,
    should_show_dialog: PropTypes.bool,
    should_show_widget: PropTypes.bool,
    onClickCopyDepositAddress: PropTypes.func,
    onClickDisclaimerContinue: PropTypes.func,
    onClickGoToDepositPage: PropTypes.func,
    pollApiForDepositAddress: PropTypes.func,
};

export default connect(({ modules }) => ({
    api_error: modules.cashier.onramp.api_error,
    deposit_address: modules.cashier.onramp.deposit_address,
    is_deposit_address_loading: modules.cashier.onramp.is_deposit_address_loading,
    is_deposit_address_popover_open: modules.cashier.onramp.is_deposit_address_popover_open,
    selected_provider: modules.cashier.onramp.selected_provider,
    setDepositAddressRef: modules.cashier.onramp.setDepositAddressRef,
    setIsOnRampModalOpen: modules.cashier.onramp.setIsOnRampModalOpen,
    should_show_dialog: modules.cashier.onramp.should_show_dialog,
    should_show_widget: modules.cashier.onramp.should_show_widget,
    onClickCopyDepositAddress: modules.cashier.onramp.onClickCopyDepositAddress,
    onClickDisclaimerContinue: modules.cashier.onramp.onClickDisclaimerContinue,
    onClickGoToDepositPage: modules.cashier.onramp.onClickGoToDepositPage,
    pollApiForDepositAddress: modules.cashier.onramp.pollApiForDepositAddress,
}))(OnRampProviderPopup);
