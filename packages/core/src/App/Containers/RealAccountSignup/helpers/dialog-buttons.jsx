import PropTypes from 'prop-types';
import React from 'react';
import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { EXPERIAN } from './constants';

const getActionButton = ({
    landing_company_shortcode,
    is_fully_authenticated,
    closeModalAndOpenCashier,
    closeModalAndOpenPOI,
}) => {
    switch (landing_company_shortcode) {
        case 'maltainvest':
            if (is_fully_authenticated) {
                return {
                    label: localize('Deposit'),
                    action: closeModalAndOpenCashier,
                };
            }
            return {
                label: localize('Submit proof'),
                action: closeModalAndOpenPOI,
            };
        case 'svg':
        default:
            return {
                label: localize('Deposit'),
                action: closeModalAndOpenCashier,
            };
    }
};
const DialogPrimaryButton = ({
    status,
    landing_company_shortcode,
    closeModal,
    closeModalAndOpenCashier,
    closeModalAndOpenPOI,
    closeModalAndOpenPOA,
    is_fully_authenticated,
}) => {
    // Check if the button is necessary
    // Fetch proper action from store based on status + landing_company_shortcode
    const { label, action } = getActionButton({
        status,
        landing_company_shortcode,
        is_fully_authenticated,
        closeModal,
        closeModalAndOpenCashier,
        closeModalAndOpenPOI,
        closeModalAndOpenPOA,
    });

    return <Button primary text={label} onClick={action} />;
};
const DialogDismissButton = ({ closeModal, is_bypassed }) => {
    if (is_bypassed) return null;

    return <Button secondary text={localize('Maybe later')} onClick={closeModal} />;
};

export const DialogButtons = ({
    status,
    landing_company_shortcode,
    is_fully_authenticated,
    closeModal,
    closeModalAndOpenCashier,
    closeModalAndOpenPOA,
    closeModalAndOpenPOI,
}) => {
    return (
        <div className='status-dialog__footer'>
            <DialogDismissButton closeModal={closeModal} is_bypassed={status === EXPERIAN.PENDING} />
            <DialogPrimaryButton
                status={status}
                landing_company_shortcode={landing_company_shortcode}
                closeModal={closeModal}
                closeModalAndOpenCashier={closeModalAndOpenCashier}
                closeModalAndOpenPOI={closeModalAndOpenPOI}
                closeModalAndOpenPOA={closeModalAndOpenPOA}
                is_fully_authenticated={is_fully_authenticated}
            />
        </div>
    );
};

DialogButtons.propTypes = {
    status: PropTypes.number,
    landing_company_shortcode: PropTypes.string,
    is_fully_authenticated: PropTypes.bool,
    closeModal: PropTypes.func,
    closeModalAndOpenCashier: PropTypes.func,
    closeModalAndOpenPOA: PropTypes.func,
    closeModalAndOpenPOI: PropTypes.func,
};
