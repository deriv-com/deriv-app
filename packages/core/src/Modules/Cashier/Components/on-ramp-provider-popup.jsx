import PropTypes from 'prop-types';
import React from 'react';
import { Button, Checkbox, Clipboard, Icon, Loading, Popover } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const OnRampProviderPopup = ({
    deposit_address,
    is_deposit_address_loading,
    is_disclaimer_checkbox_checked,
    onClickCopyDepositAddress,
    onDisclaimerCheckboxChange,
    pollForDepositAddress,
    selected_provider,
    setDepositAddressRef,
    should_show_widget,
}) => {
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
    if (!deposit_address) {
        return (
            <div className='on-ramp__popup-no-deposit-address'>
                <Button text={localize('Go to Deposit page.')} onClick={pollForDepositAddress} primary large />
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
                    <span
                        className='on-ramp__popup-deposit-address-text'
                        onClick={onClickCopyDepositAddress}
                        ref={setDepositAddressRef}
                    >
                        {deposit_address}
                    </span>
                    <Clipboard
                        className='on-ramp__popup-deposit-address-icon'
                        custom_colour_icon_copy='var(--text-prominent)'
                        info_message={localize('Click here to copy your deposit address')}
                        success_message={localize('Copied!')}
                        text_copy='Copy me'
                        onClickCopy={onClickCopyDepositAddress}
                    />
                </div>
                <div className='on-ramp__popup-deposit-footer'>
                    <Localize i18n_default_text='This address can only be used ONCE. Please copy a new one for your next transaction.' />
                </div>
            </div>
            <div className='on-ramp__popup-divider' />
            <div className='on-ramp__popup-disclaimer'>
                <h2 className='on-ramp__popup-disclaimer-title'>
                    <Localize i18n_default_text='Disclaimer' />
                </h2>
                <div className='on-ramp__popup-disclaimer-text'>
                    <Localize
                        i18n_default_text="Please note that by clicking 'Continue', you'll leave Deriv.app. Your payment will be processed by {{ service }}, a third-party payment service provider. We are not liable for {{ service }}'s security or performance."
                        values={{ service: selected_provider.name }}
                    />
                </div>
                <div className='on-ramp__popup-disclaimer-checkbox'>
                    <Checkbox
                        label={localize("I've read the disclaimer, and I agree to the above terms.")}
                        onChange={onDisclaimerCheckboxChange}
                        defaultChecked={is_disclaimer_checkbox_checked}
                    />
                </div>
            </div>
        </div>
    );
};

OnRampProviderPopup.propTypes = {
    deposit_address: PropTypes.string,
    is_deposit_address_loading: PropTypes.bool,
    is_disclaimer_checkbox_checked: PropTypes.bool,
    selected_provider: PropTypes.object,
    setDepositAddressRef: PropTypes.func,
    setSelectedProvider: PropTypes.func,
    should_show_widget: PropTypes.bool,
    onClickCopyDepositAddress: PropTypes.func,
    onDisclaimerCheckboxChange: PropTypes.func,
    pollForDepositAddress: PropTypes.func,
};

export default connect(({ modules }) => ({
    deposit_address: modules.cashier.onramp.deposit_address,
    is_deposit_address_loading: modules.cashier.onramp.is_deposit_address_loading,
    is_disclaimer_checkbox_checked: modules.cashier.onramp.is_disclaimer_checkbox_checked,
    selected_provider: modules.cashier.onramp.selected_provider,
    setDepositAddressRef: modules.cashier.onramp.setDepositAddressRef,
    setSelectedProvider: modules.cashier.onramp.setSelectedProvider,
    should_show_widget: modules.cashier.onramp.should_show_widget,
    onClickCopyDepositAddress: modules.cashier.onramp.onClickCopyDepositAddress,
    onDisclaimerCheckboxChange: modules.cashier.onramp.onDisclaimerCheckboxChange,
    pollForDepositAddress: modules.cashier.onramp.pollForDepositAddress,
}))(OnRampProviderPopup);
