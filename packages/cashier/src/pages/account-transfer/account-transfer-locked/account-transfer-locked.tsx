import React from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { routes } from '@deriv/shared';
import { Icon, Checklist, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useStore } from '@deriv/stores';

const AccountTransferLocked = () => {
    const {
        client: { is_financial_account, is_financial_information_incomplete, is_trading_experience_incomplete },
    } = useStore();

    const history = useHistory();
    const items = [
        ...(is_financial_account && (is_financial_information_incomplete || is_trading_experience_incomplete)
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
        <div className='cashier-locked'>
            <Icon icon='IcMoneyTransfer' className='cashier-locked__icon' />
            <Text as='h2' weight='bold' align='center' className='cashier-locked__title'>
                {localize('Transfers are locked')}
            </Text>
            <React.Fragment>
                <p className='cashier-locked__desc'>
                    {localize('To enable this feature you must complete the following:')}
                </p>
                <Checklist className='cashier-locked__checklist' items={items} />
            </React.Fragment>
        </div>
    );
};

export default observer(AccountTransferLocked);
