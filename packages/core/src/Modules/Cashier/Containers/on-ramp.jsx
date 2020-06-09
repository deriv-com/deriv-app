import PropTypes from 'prop-types';
import React from 'react';
import { Button, Modal } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import OnRampProviderCard from '../Components/on-ramp-provider-card.jsx';
import OnRampProviderPopup from '../Components/on-ramp-provider-popup.jsx';
import Virtual from '../Components/Error/virtual.jsx';
import 'Sass/app/modules/on-ramp.scss';

const OnRamp = ({
    is_disclaimer_checkbox_checked,
    is_virtual,
    is_onramp_modal_open,
    providers,
    onramp_popup_modal_title,
    setIsOnRampModalOpen,
    onClickDisclaimerContinue,
    onOnRampPopupUnmount,
    should_show_widget,
}) => {
    if (is_virtual) {
        return <Virtual />;
    }

    return (
        <div className='on-ramp'>
            <h2 className='on-ramp__page-header'>{localize('Select payment channel')}</h2>
            {providers.map((provider, idx) => (
                <OnRampProviderCard key={idx} provider={provider} />
            ))}
            <Modal
                className='on-ramp__popup'
                has_close_icon
                is_open={is_onramp_modal_open}
                large
                title={onramp_popup_modal_title}
                toggleModal={() => setIsOnRampModalOpen(!is_onramp_modal_open)}
                onUnmount={onOnRampPopupUnmount}
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
                                text={localize('Continue')}
                                onClick={onClickDisclaimerContinue}
                                primary
                                large
                                disabled={!is_disclaimer_checkbox_checked}
                            />
                        </Button.Group>
                    </Modal.Footer>
                )}
            </Modal>
        </div>
    );
};

OnRamp.propTypes = {
    is_virtual: PropTypes.bool,
    providers: PropTypes.array,
};

export default connect(({ client, modules }) => ({
    is_disclaimer_checkbox_checked: modules.cashier.config.onramp.is_disclaimer_checkbox_checked,
    is_virtual: client.is_virtual,
    is_onramp_modal_open: modules.cashier.config.onramp.is_onramp_modal_open,
    onramp_popup_modal_title: modules.cashier.config.onramp.onramp_popup_modal_title,
    providers: modules.cashier.config.onramp.providers,
    selected_provider: modules.cashier.config.onramp.selected_provider,
    should_show_widget: modules.cashier.config.onramp.should_show_widget,
    setIsOnRampModalOpen: modules.cashier.config.onramp.setIsOnRampModalOpen,
    setSelectedProvider: modules.cashier.config.onramp.setSelectedProvider,
    onClickDisclaimerContinue: modules.cashier.config.onramp.onClickDisclaimerContinue,
    onOnRampPopupUnmount: modules.cashier.config.onramp.onOnRampPopupUnmount,
}))(OnRamp);
