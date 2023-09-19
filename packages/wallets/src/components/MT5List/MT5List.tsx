import React, { useMemo } from 'react';
import { useMT5AccountsList, useTradingPlatformAvailableAccounts } from '@deriv/api';
import DerivedMT5 from '../../public/images/mt5-derived.svg';
import FinancialMT5 from '../../public/images/mt5-financial.svg';
import SwapFreeMT5 from '../../public/images/mt5-swap-free.svg';
import { PrimaryActionButton } from '../PrimaryActionButton';
import { SecondaryActionButton } from '../SecondaryActionButton';
import { TradingAccountCard } from '../TradingAccountCard';
import './MT5List.scss';

const useAvailableMT5Accounts = () => {
    const { data: all_available_mt5_accounts } = useTradingPlatformAvailableAccounts();
    const { data: mt5_accounts, ...rest } = useMT5AccountsList();

    const modified_data = useMemo(() => {
        if (!all_available_mt5_accounts || !mt5_accounts) return;

        return all_available_mt5_accounts?.map(available_account => {
            const created_account = mt5_accounts?.find(account => {
                return (
                    available_account.market_type === account.market_type &&
                    available_account.shortcode === account.landing_company_short
                );
            });
            if (created_account)
                return {
                    ...created_account,
                    /** Determine if the account is added or not */
                    is_added: true,
                } as const;

            return {
                ...available_account,
                /** Determine if the account is added or not */
                is_added: false,
            } as const;
        });
    }, [all_available_mt5_accounts, mt5_accounts]);

    // Reduce out the added accounts to make sure only one of each market_type is shown
    const filtered_data = useMemo(() => {
        if (!modified_data) return;

        return modified_data.reduce((acc, account) => {
            const existing_account = acc.find(acc_account => acc_account.market_type === account.market_type);
            if (existing_account) return acc;

            return [...acc, account];
        }, [] as typeof modified_data);
    }, [modified_data]);

    // Sort the data by market_type to make sure the order is 'synthetic', 'financial', 'all'
    const sorted_data = useMemo(() => {
        if (!filtered_data) return;

        const sorted_data = [...filtered_data].sort((a, b) => {
            if (a.market_type === 'synthetic') return -1;
            if (b.market_type === 'synthetic') return 1;
            if (a.market_type === 'financial') return -1;
            if (b.market_type === 'financial') return 1;
            if (a.market_type === 'all') return -1;
            if (b.market_type === 'all') return 1;
            return 0;
        });

        return sorted_data;
    }, [filtered_data]);

    return {
        data: sorted_data,
        ...rest,
    };
};

const market_type_to_icon_mapper = {
    all: <SwapFreeMT5 />,
    financial: <FinancialMT5 />,
    synthetic: <DerivedMT5 />,
};

const market_type_to_name_mapper = {
    all: 'Swap-Free',
    financial: 'Financial',
    synthetic: 'Derived',
};

const market_type_to_description_mapper = {
    all: 'Trade swap-free CFDs on MT5 with synthetics, forex, stocks, stock indices, cryptocurrencies and ETFs',
    financial: 'This account offers CFDs on financial instruments.',
    synthetic: 'This account offers CFDs on derived instruments.',
};

const MT5List: React.FC = () => {
    const { data } = useAvailableMT5Accounts();

    if (!data) return <p>Loading...</p>;

    return (
        <>
            <section className='wallets-mt5-list'>
                <div className='wallets-mt5-list__title'>
                    <h1>Deriv MT5</h1>
                </div>
            </section>
            <div className='wallets-mt5-list__content'>
                {data?.map((account, index) => {
                    if (account.is_added)
                        return (
                            <TradingAccountCard
                                key={account.loginid}
                                leading={() => (
                                    <div className='wallets-options-and-multipliers-listing__content__icon'>
                                        {market_type_to_icon_mapper[account.market_type || 'all']}
                                    </div>
                                )}
                                trailing={() => (
                                    <PrimaryActionButton>
                                        <p className='wallets-other-cfd__text'>Open</p>
                                    </PrimaryActionButton>
                                )}
                            >
                                <div className='wallets-options-and-multipliers-listing__content__details'>
                                    <p className='wallets-options-and-multipliers-listing__content__details-title'>
                                        {market_type_to_name_mapper[account.market_type || 'all']}
                                    </p>
                                    <p className='wallets-options-and-multipliers-listing__content__details-description'>
                                        {account.display_balance}
                                    </p>
                                    <p className='wallets-options-and-multipliers-listing__content__details-description'>
                                        {account.display_login}
                                    </p>
                                </div>
                            </TradingAccountCard>
                        );

                    return (
                        <TradingAccountCard
                            key={`${account.market_type}-${index}`}
                            leading={() => (
                                <div className='wallets-options-and-multipliers-listing__content__icon'>
                                    {market_type_to_icon_mapper[account.market_type || 'all']}
                                </div>
                            )}
                            trailing={() => (
                                <SecondaryActionButton>
                                    <p className='wallets-other-cfd__text'>Get</p>
                                </SecondaryActionButton>
                            )}
                        >
                            <div className='wallets-options-and-multipliers-listing__content__details'>
                                <p className='wallets-options-and-multipliers-listing__content__details-title'>
                                    {market_type_to_name_mapper[account.market_type || 'all']}
                                </p>
                                <p className='wallets-options-and-multipliers-listing__content__details-description'>
                                    {market_type_to_description_mapper[account.market_type || 'all']}
                                </p>
                            </div>
                        </TradingAccountCard>
                    );
                })}
            </div>
        </>
    );
};

export default MT5List;
