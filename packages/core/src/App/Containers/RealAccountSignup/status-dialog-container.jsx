import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Div100vhContainer, Icon } from '@deriv/components';
import { routes, isDesktop, isMobile } from '@deriv/shared';
import { connect } from 'Stores/connect';
import { EXPERIAN, getExperianResult } from './helpers/constants';
import { DialogHeading } from './helpers/dialog-heading.jsx';
import { DialogMessage } from './helpers/dialog-message.jsx';
import { DialogButtons } from './helpers/dialog-buttons.jsx';

const MainIcon = ({ currency }) => <Icon icon={`IcCurrency-${currency.toLowerCase()}`} size={120} />;
const Checkmark = ({ className }) => <Icon className={className} icon='IcCheckmarkCircle' color='green' size={24} />;
const Warning = ({ className }) => <Icon className={className} icon='IcAlertDanger' size={24} />;
const Danger = ({ className }) => <Icon className={className} icon='IcCrossCircle' size={24} color='red' />;

const StatusDialogContainer = ({
    closeModal,
    currency,
    history,
    icon_size,
    is_age_verified,
    is_belgium_residence,
    is_fully_authenticated,
    is_isle_of_man_residence,
    landing_company_shortcode,
    switchToVirtual,
}) => {
    const closeModalAndOpenCashier = () => {
        closeModal();
        history.push(routes.cashier_deposit);
    };

    const closeModalAndOpenPOI = () => {
        closeModal();
        history.push(routes.proof_of_identity);
    };

    const closeModalAndOpenPOA = () => {
        closeModal();
        history.push(routes.proof_of_address);
    };

    /**
     * Get the status for the current account
     *
     * @readonly
     * @return {EXPERIAN} status
     */
    const getStatus = () =>
        getExperianResult({
            landing_company_shortcode,
            is_fully_authenticated,
            is_age_verified,
            is_isle_of_man_residence,
            is_belgium_residence,
        });

    return (
        <Div100vhContainer className='status-dialog' is_disabled={isDesktop()} height_offset='40px'>
            <div
                className={classNames('status-dialog__icon-area', {
                    'status-dialog__icon-area--large': icon_size === 'large',
                    'status-dialog__icon-area--xlarge': icon_size === 'xlarge',
                })}
            >
                <MainIcon currency={currency} />
                {getStatus() === EXPERIAN.SUCCESS && <Checkmark className='bottom-right-overlay' />}
                {getStatus() === EXPERIAN.WARN && <Warning className='bottom-right-overlay' />}
                {getStatus() === EXPERIAN.DANGER && <Danger className='bottom-right-overlay' />}
            </div>
            <div
                className={classNames('status-dialog__body-area', {
                    'status-dialog__body-area--no-grow': isMobile(),
                })}
            >
                <DialogHeading status={getStatus()} landing_company_shortcode={landing_company_shortcode} />
                <DialogMessage
                    status={getStatus()}
                    landing_company_shortcode={landing_company_shortcode}
                    currency={currency}
                />
            </div>
            <DialogButtons
                landing_company_shortcode={landing_company_shortcode}
                status={getStatus()}
                closeModal={closeModal}
                closeModalAndOpenPOI={closeModalAndOpenPOI}
                closeModalAndOpenPOA={closeModalAndOpenPOA}
                closeModalAndOpenCashier={closeModalAndOpenCashier}
                switchToVirtual={switchToVirtual}
            />
        </Div100vhContainer>
    );
};

StatusDialogContainer.defaultProps = {
    icon_size: 'large',
};

StatusDialogContainer.propTypes = {
    currency: PropTypes.string,
    closeModal: PropTypes.func,
    icon: PropTypes.object,
    icon_size: PropTypes.string,
    is_isle_of_man_residence: PropTypes.bool,
    is_belgium_residence: PropTypes.bool,
};

export default connect(({ client }) => ({
    landing_company_shortcode: client.landing_company_shortcode,
    is_fully_authenticated: client.is_fully_authenticated,
    is_age_verified: client.is_age_verified,
    is_isle_of_man_residence: client.residence === 'im', // TODO: [deriv-eu] refactor this once more residence checks are required
    is_belgium_residence: client.residence === 'be', // TODO: [deriv-eu] refactor this once more residence checks are required
    switchToVirtual: () => client.switchAccount(client.virtual_account_loginid),
}))(withRouter(StatusDialogContainer));
