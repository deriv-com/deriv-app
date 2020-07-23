import PropTypes from 'prop-types';
import React from 'react';
import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { EXPERIAN } from './constants';

const getDismissButton = ({ status, landing_company_shortcode, closeModal, switchToVirtual }) => {
    switch (landing_company_shortcode) {
        case 'iom':
            if (status === EXPERIAN.SUCCESS) {
                return {
                    label: localize('Maybe later'),
                    action: closeModal,
                };
            } else if (status === EXPERIAN.WARN) {
                return {
                    label: localize('Trade on demo account'),
                    action: () => {
                        closeModal();
                        switchToVirtual();
                    },
                };
            }
            // Danger
            return {
                label: localize('Maybe later'),
                action: closeModal,
            };
        // case 'svg':
        default:
            return {
                label: localize('Maybe later'),
                action: closeModal,
            };
    }
};

const getActionButton = ({
    status,
    landing_company_shortcode,
    closeModalAndOpenCashier,
    closeModalAndOpenPOI,
    closeModalAndOpenPOA,
}) => {
    switch (landing_company_shortcode) {
        case 'iom':
            if (status === EXPERIAN.DANGER) {
                return {
                    label: localize('Submit proofs'),
                    action: closeModalAndOpenPOI,
                };
            } else if (status === EXPERIAN.WARN) {
                return {
                    label: localize('Upload documents'),
                    action: closeModalAndOpenPOA,
                };
            }

            return {
                label: localize('Deposit now'),
                action: closeModalAndOpenCashier,
            };
        case 'maltainvest':
            return {
                label: localize('Submit proof'),
                action: closeModalAndOpenPOI,
            };
        case 'svg':
        case 'malta':
        default:
            return {
                label: localize('Deposit now'),
                action: closeModalAndOpenCashier,
            };
    }
};
const DialogPrimaryButton = ({
    status,
    landing_company_shortcode,
    closeModalAndOpenCashier,
    closeModalAndOpenPOI,
    closeModalAndOpenPOA,
}) => {
    // Check if the button is necessary
    // Fetch proper action from store based on status + landing_company_shortcode
    const { label, action } = getActionButton({
        status,
        landing_company_shortcode,
        closeModalAndOpenCashier,
        closeModalAndOpenPOI,
        closeModalAndOpenPOA,
    });

    return <Button primary text={label} onClick={action} />;
};
const DialogDismissButton = ({ status, landing_company_shortcode, closeModal, switchToVirtual }) => {
    const { label, action } = getDismissButton({
        status,
        landing_company_shortcode,
        closeModal,
        switchToVirtual,
    });

    return <Button secondary text={label} onClick={action} />;
};
export const DialogButtons = ({
    status,
    landing_company_shortcode,
    closeModal,
    closeModalAndOpenCashier,
    closeModalAndOpenPOA,
    closeModalAndOpenPOI,
    switchToVirtual,
}) => {
    return (
        <div className='status-dialog__btn-area'>
            <DialogDismissButton
                closeModal={closeModal}
                status={status}
                landing_company_shortcode={landing_company_shortcode}
                switchToVirtual={switchToVirtual}
            />
            <DialogPrimaryButton
                status={status}
                landing_company_shortcode={landing_company_shortcode}
                closeModalAndOpenCashier={closeModalAndOpenCashier}
                closeModalAndOpenPOI={closeModalAndOpenPOI}
                closeModalAndOpenPOA={closeModalAndOpenPOA}
            />
        </div>
    );
};

DialogButtons.propTypes = {
    status: PropTypes.number,
    landing_company_shortcode: PropTypes.string,
    closeModal: PropTypes.func,
    closeModalAndOpenCashier: PropTypes.func,
    closeModalAndOpenPOI: PropTypes.func,
    switchToVirtual: PropTypes.func,
};
