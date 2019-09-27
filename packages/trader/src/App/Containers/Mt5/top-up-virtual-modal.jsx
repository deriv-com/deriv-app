import classNames        from 'classnames';
import { Modal, Button } from 'deriv-components';
import PropTypes         from 'prop-types';
import React             from 'react';
import { localize }      from 'App/i18n';
import Localize          from 'App/Components/Elements/localize.jsx';
import Money             from 'App/Components/Elements/money.jsx';
import SuccessDialog     from 'App/Containers/Modals/success-dialog.jsx';
import IconWallet        from 'Assets/Mt5/icon-wallet.jsx';
import { connect }       from 'Stores/connect';

class TopUpVirtualModal extends React.Component {
    accountTitle = () => {
        if (!this.props.mt5_companies || !this.props.current_account) return '';
        return this.props.mt5_companies
            [this.props.current_account.category]
            [this.props.current_account.type]
            .title;
    };

    closeSuccess = () => {
        this.props.closeSuccessTopUpModal();
    }

    render() {
        if (!this.props.mt5_companies || !this.props.current_account) return null;
        const title = this.accountTitle();
        return (
            <React.Fragment>
                <Modal
                    toggleModal={this.props.closeTopUpModal}
                    is_open={this.props.is_top_up_virtual_open}
                    className='top-up-virtual'
                    header={localize('Fund Top up')}
                >
                    <div className='dc-modal__container_top-up-virtual__body'>
                        <p className='dc-modal__container_top-up-virtual__description'>
                            <Localize
                                i18n_default_text='You can top up your demo account with an additional USD 10,000.00 if your balance is USD 1,000.00 or less.'
                            />
                        </p>
                        <h4 className='dc-modal__container_top-up-virtual--h4'>
                            <Localize
                                i18n_default_text='DMT5 {{ account_title }} account'
                                values={{
                                    account_title: title,
                                }}
                            />
                        </h4>
                        <div>
                            <p className='dc-modal__container_top-up-virtual--balance-descriptor'>
                                <Localize
                                    i18n_default_text='Current balance'
                                />
                            </p>
                            <div className='dc-modal__container_top-up-virtual--balance'>
                                <Money
                                    amount={this.props.current_account.display_balance}
                                    currency={this.props.current_account.currency}
                                />
                            </div>
                        </div>
                        <div className='dc-modal__container_top-up-virtual--button'>
                            <Button
                                className={classNames({
                                    'btn--disabled': this.props.current_account.balance > 1000,
                                })}
                                is_disabled={this.props.current_account.balance > 1000}
                                type='button'
                                onClick={this.props.topUpVirtual}
                            >
                                <Localize
                                    i18n_default_text='Top up USD 10,000.00'
                                />
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal
                    className='top-up-virtual'
                    is_open={this.props.is_top_up_virtual_success}
                    toggleModal={this.closeSuccess}
                    has_close_icon={false}
                >
                    <SuccessDialog
                        icon={<IconWallet />}
                        heading={(
                            <h3 className='mt5-success-topup__heading'>
                                <Localize
                                    i18n_default_text='USD 10,000.00 has been credited into your DMT5 {{title}} account.'
                                    values={{
                                        title,
                                    }}
                                />
                            </h3>
                        )}
                        message={(
                            <div className='mt5-success-topup__description'>
                                <p>
                                    <Localize
                                        i18n_default_text='New current balance'
                                    />
                                </p>
                                <div className='dc-modal__container_top-up-virtual--balance'>
                                    <Money
                                        amount={this.props.current_account.balance}
                                        currency={this.props.current_account.currency}
                                    />
                                </div>
                            </div>
                        )}
                        icon_size='xlarge'
                        has_cancel={false}
                        has_submit={false}
                    />
                </Modal>
            </React.Fragment>
        );
    }
}

TopUpVirtualModal.propTypes = {
    account_title            : PropTypes.string,
    closeSuccessTopUpModal   : PropTypes.func,
    closeTopUpVirtual        : PropTypes.func,
    currency                 : PropTypes.string,
    display_balance          : PropTypes.string,
    is_top_up_virtual_open   : PropTypes.bool,
    is_top_up_virtual_success: PropTypes.bool,
    topUpVirtual             : PropTypes.func,
};

export default connect(({ ui, modules }) => ({
    is_top_up_virtual_open   : ui.is_top_up_virtual_open,
    is_top_up_virtual_success: ui.is_top_up_virtual_success,
    closeTopUpModal          : ui.closeTopUpModal,
    closeSuccessTopUpModal   : ui.closeSuccessTopUpModal,
    current_account          : modules.mt5.current_account,
    mt5_companies            : modules.mt5.mt5_companies,
    topUpVirtual             : modules.mt5.topUpVirtual,
}))(TopUpVirtualModal);
