import React from 'react';
import { useHistory } from 'react-router-dom';
import DerivApps from '../../public/images/deriv-apps.svg';
import { THooks } from '../../types';
import { WalletButton, WalletText } from '../Base';
import { WalletListCardBadge } from '../WalletListCardBadge';

type TProps = {
    isDemo?: THooks.ActiveWalletAccount['is_virtual'];
    label?: THooks.ActiveWalletAccount['landing_company_name'];
    tradingAccountLoginId?: string;
};

const DerivAppsTradingAccount: React.FC<TProps> = ({ isDemo, label, tradingAccountLoginId }) => {
    const history = useHistory();
    return (
        <div className='wallets-deriv-apps-section'>
            <DerivApps />
            <div className='wallets-deriv-apps-section__details'>
                <div className='wallets-deriv-apps-section__title-and-badge'>
                    <WalletText size='sm'>Deriv Apps</WalletText>
                    <WalletListCardBadge isDemo={isDemo} label={label} />
                </div>
                <WalletText size='sm' weight='bold'>
                    [Balance]
                </WalletText>
                <WalletText color='less-prominent' lineHeight='sm' size='xs' weight='bold'>
                    {tradingAccountLoginId}
                </WalletText>
            </div>
            <WalletButton
                color='white'
                onClick={() => {
                    history.push('wallets/cashier/transfer');
                }}
                text='Transfer'
                variant='outlined'
            />
        </div>
    );
};

export { DerivAppsTradingAccount };
