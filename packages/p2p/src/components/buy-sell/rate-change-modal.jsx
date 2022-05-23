import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize, Localize } from 'Components/i18next';
import './rate-change-modal.scss';

const RateChangeModal = ({ local_currency, should_show_rate_change_modal, setShouldShowRateChangeModal }) => {
    const closeModal = () => {
        setShouldShowRateChangeModal(false);
    };
    return (
        <Modal is_open={should_show_rate_change_modal} toggleModal={closeModal} small>
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
                <Button onClick={closeModal} text={localize('Try again')} primary large />
            </div>
        </Modal>
    );
};

RateChangeModal.propTypes = {
    local_currency: PropTypes.string,
    should_show_rate_change_modal: PropTypes.bool,
    setShouldShowRateChangeModal: PropTypes.func,
};

export default RateChangeModal;
