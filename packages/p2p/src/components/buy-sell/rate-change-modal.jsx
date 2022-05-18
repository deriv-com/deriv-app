import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize, Localize } from 'Components/i18next';
import 'Components/buy-sell/rate-change-modal.scss';

const RateChangeModal = ({ local_currency, show_rate_changed_popup, setShowRateChangedPopup }) => {
    const cancelModal = () => {
        setShowRateChangedPopup(false);
    };
    return (
        <Modal is_open={show_rate_changed_popup} toggleModal={cancelModal} width={'440px'}>
            <div>
                <Text
                    as='p'
                    align='left'
                    className='rate-changed-modal__message'
                    size={isMobile() ? 'xxs' : 'xs'}
                    line_height='s'
                >
                    <Localize
                        i18n_default_text={'The {{local_currency}} market rate has changed.'}
                        values={{ local_currency }}
                    />
                </Text>
            </div>

            <div className='rate-changed-modal__button'>
                <Button onClick={cancelModal} text={localize('Try again')} primary large />
            </div>
        </Modal>
    );
};

RateChangeModal.propTypes = {
    local_currency: PropTypes.string,
    show_rate_changed_popup: PropTypes.bool,
    setShowRateChangedPopup: PropTypes.func,
};

export default RateChangeModal;
