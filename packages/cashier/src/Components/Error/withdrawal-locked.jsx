import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { routes } from '@deriv/shared';
import { Icon, Checklist, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import CashierLocked from './cashier-locked.jsx';

const WithdrawalLocked = ({ is_10K_limit, is_ask_financial_risk_approval }) => {
    const history = useHistory();
    const items = [
        ...(is_ask_financial_risk_approval
            ? [
                  {
                      content: localize('Complete the financial assessment form'),
                      status: 'action',
                      onClick: () => history.push(routes.financial_assessment),
                  },
              ]
            : []),
    ];
    return (
        <React.Fragment>
            {items.length ? (
                <div className='cashier-locked'>
                    <Icon icon='IcCashierWithdrawalLock' className='cashier-locked__icon' />
                    <Text as='h2' weight='bold' align='center' className='cashier-locked__title'>
                        {is_10K_limit
                            ? localize(
                                  'You have reached the withdrawal limit. Please upload your proof of identity and address to lift your withdrawal limit and proceed with your withdrawal.'
                              )
                            : localize('Withdrawals are locked')}
                    </Text>
                    <React.Fragment>
                        {!is_10K_limit && (
                            <p className='cashier-locked__desc'>
                                {localize('To enable this feature you must complete the following:')}
                            </p>
                        )}
                        <Checklist className='cashier-locked__checklist' items={items} />
                    </React.Fragment>
                </div>
            ) : (
                <CashierLocked />
            )}
        </React.Fragment>
    );
};

WithdrawalLocked.propTypes = {
    account_status: PropTypes.object,
    is_10K_limit: PropTypes.bool,
    is_ask_financial_risk_approval: PropTypes.bool,
};

export default connect(({ modules, client }) => ({
    account_status: client.account_status,
    is_ask_financial_risk_approval: modules.cashier.config.withdraw.error.is_ask_financial_risk_approval,
}))(WithdrawalLocked);
