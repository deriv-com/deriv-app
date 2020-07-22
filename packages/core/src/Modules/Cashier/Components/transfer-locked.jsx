import React from 'react';
import { withRouter } from 'react-router-dom';
import { routes } from '@deriv/shared';
import { Icon, Checklist } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const WithdrawalLocked = ({
    has_financial_account,
    is_financial_information_incomplete,
    is_trading_experience_incomplete,
    history,
}) => {
    const items = [
        (is_financial_information_incomplete || (has_financial_account && is_trading_experience_incomplete)) && {
            content: localize('Complete the financial assessment form'),
            status: 'action',
            onClick: () => history.push(routes.financial_assessment),
        },
    ];
    return (
        <div className='transfer-locked'>
            <Icon icon='IcMoneyTransfer' className='transfer-locked__icon' />
            <h2 className='transfer-locked__title'>{localize('Transfers are locked')}</h2>
            <>
                <p className='transfer-locked__desc'>
                    {localize('To enable this feature you must complete the following:')}
                </p>
                <Checklist className='transfer-locked__checklist' items={items} />
            </>
        </div>
    );
};

export default connect(({ client }) => ({
    account_status: client.account_status,
    has_financial_account: client.has_financial_account,
    is_financial_information_incomplete: client.is_financial_information_incomplete,
    is_trading_experience_incomplete: client.is_trading_experience_incomplete,
}))(withRouter(WithdrawalLocked));
