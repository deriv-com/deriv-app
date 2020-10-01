import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Div100vhContainer, Icon } from '@deriv/components';
import { routes, isDesktop } from '@deriv/shared';
import { connect } from 'Stores/connect';
import { EXPERIAN, getExperianResult } from './helpers/constants';
import { DialogHeading } from './helpers/dialog-heading.jsx';
import { DialogMessage } from './helpers/dialog-message.jsx';
import { DialogButtons } from './helpers/dialog-buttons.jsx';

const MainIcon = ({ currency }) => <Icon icon={`IcCurrency-${currency.toLowerCase()}`} size={120} />;
const Checkmark = ({ className }) => <Icon className={className} icon='IcCheckmarkCircle' color='green' size={24} />;
const Warning = ({ className }) => <Icon className={className} icon='IcAlertDanger' size={24} />;
const Danger = ({ className }) => <Icon className={className} icon='IcCrossCircle' size={24} color='red' />;

class StatusDialogContainer extends React.Component {
    static defaultProps = {
        icon_size: 'large',
        has_cancel: false,
        has_submit: true,
    };

    closeModalAndOpenCashier = () => {
        this.props.closeModal();
        this.props.history.push(routes.cashier_deposit);
    };

    closeModalAndOpenPOI = () => {
        this.props.closeModal();
        this.props.history.push(routes.proof_of_identity);
    };

    closeModalAndOpenPOA = () => {
        this.props.closeModal();
        this.props.history.push(routes.proof_of_address);
    };

    /**
     * Get the status for the current account
     *
     * @readonly
     * @return {EXPERIAN} status
     */
    get status() {
        const {
            landing_company_shortcode,
            is_fully_authenticated,
            is_age_verified,
            is_isle_of_man_residence,
            is_belgium_residence,
        } = this.props;

        return getExperianResult({
            landing_company_shortcode,
            is_fully_authenticated,
            is_age_verified,
            is_isle_of_man_residence,
            is_belgium_residence,
        });
    }

    render() {
        const {
            landing_company_shortcode,
            currency,
            closeModal,
            icon_size,
            switchToVirtual,
            is_isle_of_man_residence,
            is_belgium_residence,
        } = this.props;

        return (
            <Div100vhContainer className='status-dialog' is_disabled={isDesktop()} height_offset='40px'>
                <div
                    className={classNames('status-dialog__icon-area', {
                        'status-dialog__icon-area--large': icon_size === 'large',
                        'status-dialog__icon-area--xlarge': icon_size === 'xlarge',
                    })}
                >
                    <MainIcon currency={currency} />
                    {this.status === EXPERIAN.SUCCESS && <Checkmark className='bottom-right-overlay' />}
                    {this.status === EXPERIAN.WARN && <Warning className='bottom-right-overlay' />}
                    {this.status === EXPERIAN.DANGER && <Danger className='bottom-right-overlay' />}
                </div>
                <div className='status-dialog__body-area'>
                    <DialogHeading status={this.status} landing_company_shortcode={landing_company_shortcode} />
                    <DialogMessage
                        status={this.status}
                        landing_company_shortcode={landing_company_shortcode}
                        currency={currency}
                        is_isle_of_man_residence={is_isle_of_man_residence}
                        is_belgium_residence={is_belgium_residence}
                    />
                </div>
                <DialogButtons
                    landing_company_shortcode={landing_company_shortcode}
                    status={this.status}
                    closeModal={closeModal}
                    closeModalAndOpenPOI={this.closeModalAndOpenPOI}
                    closeModalAndOpenPOA={this.closeModalAndOpenPOA}
                    closeModalAndOpenCashier={this.closeModalAndOpenCashier}
                    switchToVirtual={switchToVirtual}
                />
            </Div100vhContainer>
        );
    }
}

StatusDialogContainer.propTypes = {
    currency: PropTypes.string,
    has_cancel: PropTypes.bool,
    has_submit: PropTypes.bool,
    heading: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    icon: PropTypes.object,
    icon_size: PropTypes.string,
    icon_type: PropTypes.string,
    is_isle_of_man_residence: PropTypes.bool,
    is_belgium_residence: PropTypes.bool,
    is_real: PropTypes.bool,
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
    text_submit: PropTypes.string,
};

export default connect(({ client, ui }) => ({
    landing_company_shortcode: client.landing_company_shortcode,
    is_fully_authenticated: client.is_fully_authenticated,
    is_age_verified: client.is_age_verified,
    is_isle_of_man_residence: client.residence === 'im', // TODO: [deriv-eu] refactor this once more residence checks are required
    is_belgium_residence: client.residence === 'be', // TODO: [deriv-eu] refactor this once more residence checks are required
    closeModal: ui.closeRealAccountSignup,
    switchToVirtual: () => client.switchAccount(client.virtual_account_loginid),
}))(withRouter(StatusDialogContainer));
