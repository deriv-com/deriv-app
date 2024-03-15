import React from 'react';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { useBalance } from '@deriv/api-v2';
import IcCashierTransfer from '../../public/images/ic-cashier-transfer.svg';
import { IconButton, WalletText } from '../Base';
import { WalletCurrencyCard } from '../WalletCurrencyCard';
import './WalletsCarouselHeader.scss';

type TProps = {
    balance?: string;
    currency: string;
    hidden?: boolean;
    isDemo?: boolean;
};

const WalletsCarouselHeader: React.FC<TProps> = ({ balance, currency, hidden, isDemo }) => {
    const history = useHistory();
    const { isLoading } = useBalance();

    return (
        <div className={classNames('wallets-carousel-header', { 'wallets-carousel-header--hidden': hidden })}>
            <div className='wallets-carousel-header__content'>
                <WalletCurrencyCard currency={currency} isCarouselHeader isDemo={isDemo} size='md' />
                <div className='wallets-carousel-header__details'>
                    <WalletText color='general' size='sm'>
                        {currency} Wallet
                    </WalletText>
                    {isLoading ? (
                        <div
                            className='wallets-skeleton wallets-carousel-header__balance-loader'
                            data-testid='dt_wallets_carousel_header_balance_loader'
                        />
                    ) : (
                        <WalletText color='general' size='lg' weight='bold'>
                            {balance}
                        </WalletText>
                    )}
                </div>
            </div>
            <IconButton
                color='transparent'
                data-testid='dt_wallets_carousel_header_button'
                icon={<IcCashierTransfer />}
                iconSize='lg'
                onClick={() => {
                    history.push(`/wallets/cashier/transfer`);
                }}
                size='lg'
            />
        </div>
    );
};

export default WalletsCarouselHeader;
