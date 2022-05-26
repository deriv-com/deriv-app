import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize, Localize } from 'Components/i18next';
import './rate-change-modal.scss';

const RateChangeModal = ({
    local_currency,
    should_show_rate_change_popup,
    setShouldShowRateChangePopup,
    setShouldShowBuySellForm,
}) => {
    const closeModal = () => {
        setShouldShowRateChangePopup(false);
        // TODO: Will remove this once https://github.com/binary-com/deriv-app/pull/5141 PR is merged
        setTimeout(() => {
            setShouldShowBuySellForm(true);
        }, 250);
    };
    return (
        <Modal is_open={should_show_rate_change_popup} toggleModal={closeModal} small>
            <Modal.Body>
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
            </Modal.Body>
            <Modal.Footer className='rate-changed-modal__button'>
                <Button onClick={closeModal} text={localize('Try again')} primary large />
            </Modal.Footer>
        </Modal>
    );
};

RateChangeModal.propTypes = {
    local_currency: PropTypes.string,
    should_show_rate_change_popup: PropTypes.bool,
    setShouldShowRateChangePopup: PropTypes.func,
};

export default RateChangeModal;
