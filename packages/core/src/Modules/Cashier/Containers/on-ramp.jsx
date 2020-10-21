import PropTypes from 'prop-types';
import React from 'react';
import { Modal } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import OnRampProviderCard from '../Components/on-ramp-provider-card.jsx';
import OnRampProviderPopup from '../Components/on-ramp-provider-popup.jsx';
import 'Sass/app/modules/on-ramp.scss';

const OnRamp = ({
    filtered_onramp_providers,
    is_onramp_modal_open,
    onMountOnramp,
    onUnmountOnramp,
    onramp_popup_modal_title,
    resetPopup,
    setIsOnRampModalOpen,
    should_show_dialog,
}) => {
    React.useEffect(() => {
        onMountOnramp();
        return () => onUnmountOnramp();
    }, [onMountOnramp, onUnmountOnramp]);

    return (
        <div className='cashier__wrapper cashier__wrapper--align-left on-ramp'>
            <h2 className='on-ramp__page-header'>
                <Localize i18n_default_text='Select payment channel' />
            </h2>
            {filtered_onramp_providers.map(provider => (
                <OnRampProviderCard key={provider.name} provider={provider} />
            ))}
            <Modal
                className='on-ramp__modal'
                has_close_icon
                is_open={is_onramp_modal_open}
                small={should_show_dialog}
                title={onramp_popup_modal_title}
                toggleModal={() => setIsOnRampModalOpen(!is_onramp_modal_open)}
                onUnmount={resetPopup}
                width={should_show_dialog ? '440px' : '628px'}
            >
                <Modal.Body>
                    <OnRampProviderPopup />
                </Modal.Body>
            </Modal>
        </div>
    );
};

OnRamp.propTypes = {
    filtered_onramp_providers: PropTypes.array,
    is_onramp_modal_open: PropTypes.bool,
    onMountOnramp: PropTypes.func,
    onUnmountOnramp: PropTypes.func,
    onramp_popup_modal_title: PropTypes.string,
    resetPopup: PropTypes.func,
    setIsOnRampModalOpen: PropTypes.func,
    should_show_dialog: PropTypes.bool,
};

export default connect(({ modules }) => ({
    filtered_onramp_providers: modules.cashier.onramp.filtered_onramp_providers,
    is_onramp_modal_open: modules.cashier.onramp.is_onramp_modal_open,
    onMountOnramp: modules.cashier.onramp.onMountOnramp,
    onUnmountOnramp: modules.cashier.onramp.onUnmountOnramp,
    onramp_popup_modal_title: modules.cashier.onramp.onramp_popup_modal_title,
    resetPopup: modules.cashier.onramp.resetPopup,
    setIsOnRampModalOpen: modules.cashier.onramp.setIsOnRampModalOpen,
    should_show_dialog: modules.cashier.onramp.should_show_dialog,
}))(OnRamp);
