import React from 'react';
import { useHistory } from 'react-router';
import CurrencySwitcherContainer from 'Components/containers/currency-switcher-container';
import { Button, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import BalanceText from 'Components/elements/text/balance-text';
import { getCurrencyName, routes, formatMoney } from '@deriv/shared';
import classNames from 'classnames';
import TradingPlatformIcon from 'Assets/svgs/trading-platform';

// wallet_data?: { currency: string; balance: string };

type TProps = {
    wallet_data: { currency: string; balance: string; loginid: string };
};

const WalletTransferBlock = React.memo(({ wallet_data }: TProps) => {
    const history = useHistory();
    const { currency, balance, loginid } = wallet_data;

    // const title = (
    //     <Text size='xs' line_height='s'>
    //         {getCurrencyName(currency)}
    //     </Text>
    // );

    // const actions = (
    //     <Button
    //         onClick={(e: MouseEvent) => {
    //             e.stopPropagation();
    //             history.push(routes.cashier_acc_transfer); // cashier_crypto_transactions
    //         }}
    //         secondary
    //         className='currency-switcher__button'
    //     >
    //         {localize('Transfer')}
    //     </Button>
    // );

    // return (
    //     <div
    //         className={classNames('currency-switcher-container', {
    //             // 'currency-switcher-container--has-interaction': has_interaction,
    //         })}
    //     >
    //         <div className='currency-switcher-container--left'>
    //             <TradingPlatformIcon icon={'Options'} size={32} className='currency-switcher__currency--icon' />
    //             <div
    //                 className={classNames(
    //                     'currency-switcher-container__content'
    //                     // `currency-switcher-container--${document_status || 'failed' || 'pending' || 'default'}`
    //                 )}
    //             >
    //                 <div
    //                     className={classNames(
    //                         'currency-switcher-container__content--text'
    //                         // `currency-switcher-container__content--text--${
    //                         //     document_status || 'failed' || 'pending' || 'default'
    //                         // }`
    //                     )}
    //                 >
    //                     {title}
    //                 </div>
    //                 <BalanceText currency={currency} balance={formatMoney(currency, balance, true)} size='xs' />
    //             </div>
    //         </div>
    //         <div className='currency-switcher-container--right'>{actions}</div>
    //     </div>
    // );

    return (
        <CurrencySwitcherContainer
            className='demo-account-card'
            title={<BalanceText currency={currency} balance={formatMoney(currency, balance, true)} size='xs' />}
            icon={'Options'}
            actions={
                <Button
                    onClick={(e: MouseEvent) => {
                        e.stopPropagation();
                        history.push(routes.cashier_acc_transfer); // cashier_crypto_transactions
                    }}
                    secondary
                    className='currency-switcher__button'
                >
                    {localize('Transfer')}
                </Button>
            }
            has_interaction
            show_dropdown={false}
        >
            {loginid}
        </CurrencySwitcherContainer>
    );
});
WalletTransferBlock.displayName = 'WalletTransferBlock';
export default WalletTransferBlock;
