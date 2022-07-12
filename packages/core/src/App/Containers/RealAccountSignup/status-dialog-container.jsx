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
const CloseIcon = ({ closeModal }) => (
    <div onClick={closeModal} className='status-dialog__close'>
        <Icon icon='IcCross' />
    </div>
);

const StatusDialogContainer = ({
    closeModal,
    country_standpoint,
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
            {isDesktop() && <CloseIcon closeModal={closeModal} />}
            <div
                className={classNames('status-dialog__header', {
                    'status-dialog__header--large': icon_size === 'large',
                    'status-dialog__header--xlarge': icon_size === 'xlarge',
                })}
            >
                <MainIcon currency={currency} />
                {getStatus() === EXPERIAN.SUCCESS && <Checkmark className='bottom-right-overlay' />}
                {getStatus() === EXPERIAN.WARN && <Warning className='bottom-right-overlay' />}
                {getStatus() === EXPERIAN.DANGER && <Danger className='bottom-right-overlay' />}
            </div>
            <div
                className={classNames('status-dialog__body', {
                    'status-dialog__body--no-grow': isMobile(),
                })}
            >
                <DialogHeading status={getStatus()} landing_company_shortcode={landing_company_shortcode} />
                <DialogMessage
                    country_standpoint={country_standpoint}
                    currency={currency}
                    is_fully_authenticated={is_fully_authenticated}
                    landing_company_shortcode={landing_company_shortcode}
                    status={getStatus()}
                />
            </div>
            <DialogButtons
                closeModal={closeModal}
                closeModalAndOpenPOI={closeModalAndOpenPOI}
                closeModalAndOpenPOA={closeModalAndOpenPOA}
                closeModalAndOpenCashier={closeModalAndOpenCashier}
                is_fully_authenticated={is_fully_authenticated}
                landing_company_shortcode={landing_company_shortcode}
                status={getStatus()}
                switchToVirtual={switchToVirtual}
            />
        </Div100vhContainer>
    );
};

StatusDialogContainer.defaultProps = {
    icon_size: 'large',
};

StatusDialogContainer.propTypes = {
    closeModal: PropTypes.func,
    country_standpoint: PropTypes.object,
    currency: PropTypes.string,
    history: PropTypes.object,
    icon: PropTypes.object,
    icon_size: PropTypes.string,
    is_age_verified: PropTypes.bool,
    is_belgium_residence: PropTypes.bool,
    is_fully_authenticated: PropTypes.bool,
    is_isle_of_man_residence: PropTypes.bool,
    landing_company_shortcode: PropTypes.string,
    switchToVirtual: PropTypes.func,
};

export default connect(({ client }) => ({
    country_standpoint: client.country_standpoint,
    landing_company_shortcode: client.landing_company_shortcode,
    is_fully_authenticated: client.is_fully_authenticated,
    is_age_verified: client.is_age_verified,
    is_isle_of_man_residence: client.residence === 'im', // TODO: [deriv-eu] refactor this once more residence checks are required
    is_belgium_residence: client.residence === 'be', // TODO: [deriv-eu] refactor this once more residence checks are required
    switchToVirtual: () => client.switchAccount(client.virtual_account_loginid),
}))(withRouter(StatusDialogContainer));
