import PropTypes from 'prop-types';
import React from 'react';
import { Modal } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import OnRampProviderCard from '../Components/on-ramp-provider-card.jsx';
import OnRampProviderPopup from '../Components/on-ramp-provider-popup.jsx';
import SideNote from '../Components/side-note.jsx';
import 'Sass/app/modules/on-ramp.scss';

const OnRampSideNote = () => {
    const notes = [
        <Localize
            i18n_default_text='Fiat onramp is a cashier service that allows you to convert fiat currencies to crypto to top up your Deriv crypto accounts. Listed here are third-party crypto exchanges. You’ll need to create an account with them to use their services.'
            key={0}
        />,
    ];

    return <SideNote notes={notes} has_bullets={false} title={<Localize i18n_default_text='What is Fiat onramp?' />} />;
};

const OnRamp = ({
    filtered_onramp_providers,
    is_onramp_modal_open,
    onMountOnramp,
    onUnmountOnramp,
    onramp_popup_modal_title,
    resetPopup,
    setIsOnRampModalOpen,
    should_show_dialog,
    setSideNotes,
}) => {
    React.useEffect(() => {
        onMountOnramp();

        if (typeof setSideNotes === 'function') {
            setSideNotes([<OnRampSideNote key={0} />]);
        }
        return () => onUnmountOnramp();
    }, [onMountOnramp, onUnmountOnramp, setSideNotes]);

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
    setSideNotes: PropTypes.func,
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
