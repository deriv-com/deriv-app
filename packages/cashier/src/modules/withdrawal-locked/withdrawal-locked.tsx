import React from 'react';
import { useHistory } from 'react-router-dom';
import { Icon, Checklist, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { routes } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { useWithdrawalLocked } from '@deriv/hooks';
import CashierLocked from '../../components/cashier-locked';

type TItem = {
    content: string;
    status: string;
    onClick: VoidFunction;
};

const WithdrawalLocked = observer(() => {
    const {
        is_poi_needed,
        has_poi_submitted,
        is_poa_needed,
        has_poa_submitted,
        is_ask_financial_risk_approval_needed,
        isLoading,
        isSuccess,
    } = useWithdrawalLocked();

    const history = useHistory();
    const items: TItem[] = [
        ...(is_poi_needed
            ? [
                  {
                      content: has_poi_submitted
                          ? localize('Check proof of identity document verification status')
                          : localize('Upload a proof of identity to verify your identity'),
                      status: 'action',
                      onClick: () => history.push(routes.proof_of_identity),
                  },
              ]
            : []),
        ...(is_poa_needed
            ? [
                  {
                      content: has_poa_submitted
                          ? localize('Check proof of address document verification status')
                          : localize('Upload a proof of address to verify your address'),
                      status: 'action',
                      onClick: () => history.push(routes.proof_of_address),
                  },
              ]
            : []),
        ...(is_ask_financial_risk_approval_needed
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
            {isSuccess &&
                (items.length ? (
                    <div className='cashier-locked'>
                        <Icon icon='IcCashierWithdrawalLock' className='cashier-locked__icon' />
                        <Text as='h2' weight='bold' align='center' className='cashier-locked__title'>
                            <Localize
                                i18n_default_text='You have reached the withdrawal limit.<0/>Please upload your proof of identity and address to lift the limit to continue your withdrawal.'
                                components={[<br key={0} />]}
                            />
                        </Text>
                        <React.Fragment>
                            <Checklist className='cashier-locked__checklist' items={items} />
                        </React.Fragment>
                    </div>
                ) : (
                    <CashierLocked />
                ))}
        </React.Fragment>
    );
});

export default WithdrawalLocked;
