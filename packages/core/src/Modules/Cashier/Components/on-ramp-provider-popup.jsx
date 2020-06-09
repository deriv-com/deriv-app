import React from 'react';
import { Icon, Checkbox, Loading, Button, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const OnRampProviderPopup = ({
    deposit_address,
    is_deposit_address_loading,
    is_deposit_address_popover_open,
    is_disclaimer_checkbox_checked,
    onClickCopyDepositAddress,
    onDisclaimerCheckboxChange,
    selected_provider,
    setDepositAddressRef,
    should_show_widget,
}) => {
    if (is_deposit_address_loading) {
        return <Loading is_fullscreen={false} />;
    }
    if (should_show_widget) {
        return <div dangerouslySetInnerHTML={{ __html: selected_provider.widget }} />;
    }

    return (
        <div className='on-ramp__popup'>
            <div className='on-ramp__popup-deposit'>
                <div className='on-ramp__popup-deposit-intro'>
                    {localize("Please copy the address you see below. You'll need it to deposit your cryptocurrency.")}
                </div>
                <div className='on-ramp__popup-deposit-address'>
                    <Popover
                        zIndex={9999}
                        alignment='right'
                        classNameTarget={'on-ramp__popup-deposit-address-popover'}
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
                            icon='IcCopy'
                            onClick={onClickCopyDepositAddress}
                            size={16}
                        />
                    </Popover>
                </div>
                <div className='on-ramp__popup-deposit-footer'>
                    <p>{localize('This address can only be used once to make a deposit.')}</p>
                    <p>{localize('For each deposit, you will have to visit here again to generate a new address.')}</p>
                </div>
            </div>
            <div className='on-ramp__popup-divider' />
            <div className='on-ramp__popup-disclaimer'>
                <h2 className='on-ramp__popup-disclaimer-title'>{localize('Disclaimer')}</h2>
                <div className='on-ramp__popup-disclaimer-text'>
                    {localize(
                        "Please note that by clicking 'Continue', you'll leave Deriv.app and go to the {{ service }} website, which is fully owned, operated, and controlled by a third-party payment service provider named {{ service }}. The processing of your payment will be subject to {{ service }}'s terms, conditions, and privacy policies. We do not control and cannot be held liable for {{ service }}'s security or performance.",
                        {
                            service: selected_provider.name,
                        }
                    )}
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

export default connect(({ modules }) => ({
    deposit_address: modules.cashier.config.onramp.deposit_address,
    is_deposit_address_loading: modules.cashier.config.onramp.is_deposit_address_loading,
    is_deposit_address_popover_open: modules.cashier.config.onramp.is_deposit_address_popover_open,
    is_disclaimer_checkbox_checked: modules.cashier.config.onramp.is_disclaimer_checkbox_checked,
    selected_provider: modules.cashier.config.onramp.selected_provider,
    setDepositAddressRef: modules.cashier.config.onramp.setDepositAddressRef,
    setSelectedProvider: modules.cashier.config.onramp.setSelectedProvider,
    should_show_widget: modules.cashier.config.onramp.should_show_widget,
    onClickCopyDepositAddress: modules.cashier.config.onramp.onClickCopyDepositAddress,
    onDisclaimerCheckboxChange: modules.cashier.config.onramp.onDisclaimerCheckboxChange,
}))(OnRampProviderPopup);
