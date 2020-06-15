import PropTypes from 'prop-types';
import React from 'react';
import { Button, Modal } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import OnRampProviderCard from '../Components/on-ramp-provider-card.jsx';
import OnRampProviderPopup from '../Components/on-ramp-provider-popup.jsx';
import Virtual from '../Components/Error/virtual.jsx';
import 'Sass/app/modules/on-ramp.scss';

const OnRamp = ({
    is_disclaimer_checkbox_checked,
    is_virtual,
    is_onramp_modal_open,
    filtered_onramp_providers,
    onramp_popup_modal_title,
    setIsOnRampModalOpen,
    onClickDisclaimerContinue,
    resetPopup,
    should_show_widget,
}) => {
    if (is_virtual) {
        return <Virtual />;
    }
    return (
        <div className='on-ramp'>
            <h2 className='on-ramp__page-header'>
                <Localize i18n_default_text='Select payment channel' />
            </h2>
            {filtered_onramp_providers.map((provider, idx) => (
                <OnRampProviderCard key={idx} provider={provider} />
            ))}
            <Modal
                className='on-ramp__popup'
                has_close_icon
                is_open={is_onramp_modal_open}
                large
                title={onramp_popup_modal_title}
                toggleModal={() => setIsOnRampModalOpen(!is_onramp_modal_open)}
                onUnmount={resetPopup}
            >
                <Modal.Body>
                    <OnRampProviderPopup />
                </Modal.Body>
                {!should_show_widget && (
                    <Modal.Footer>
                        <Button.Group className='on-ramp__popup-buttons'>
                            <Button
                                large
                                onClick={() => setIsOnRampModalOpen(false)}
                                secondary
                                text={localize('Cancel')}
                            />
                            <Button
                                disabled={!is_disclaimer_checkbox_checked}
                                large
                                onClick={onClickDisclaimerContinue}
                                primary
                                text={localize('Continue')}
                            />
                        </Button.Group>
                    </Modal.Footer>
                )}
            </Modal>
        </div>
    );
};

OnRamp.propTypes = {
    filtered_onramp_providers: PropTypes.array,
    is_disclaimer_checkbox_checked: PropTypes.bool,
    is_onramp_modal_open: PropTypes.bool,
    is_virtual: PropTypes.bool,
    resetPopup: PropTypes.func,
    selected_provider: PropTypes.object,
    should_show_widget: PropTypes.bool,
    setIsOnRampModalOpen: PropTypes.func,
    setSelectedProvider: PropTypes.func,
    onramp_popup_modal_title: PropTypes.string,
    onClickDisclaimerContinue: PropTypes.func,
};

export default connect(({ client, modules }) => ({
    filtered_onramp_providers: modules.cashier.onramp.filtered_onramp_providers,
    is_disclaimer_checkbox_checked: modules.cashier.onramp.is_disclaimer_checkbox_checked,
    is_onramp_modal_open: modules.cashier.onramp.is_onramp_modal_open,
    is_virtual: client.is_virtual,
    resetPopup: modules.cashier.onramp.resetPopup,
    selected_provider: modules.cashier.onramp.selected_provider,
    should_show_widget: modules.cashier.onramp.should_show_widget,
    setIsOnRampModalOpen: modules.cashier.onramp.setIsOnRampModalOpen,
    setSelectedProvider: modules.cashier.onramp.setSelectedProvider,
    onramp_popup_modal_title: modules.cashier.onramp.onramp_popup_modal_title,
    onClickDisclaimerContinue: modules.cashier.onramp.onClickDisclaimerContinue,
}))(OnRamp);
