import React from 'react';
import { useCtraderAccountsList, useDxtradeAccountsList, useLandingCompany, useSortedMT5Accounts } from '@deriv/api-v2';
import { TradingAppCardLoader } from '../../../../components/SkeletonLoader';
import {
    AddedCTraderAccountsList,
    AddedDxtradeAccountsList,
    AddedMT5AccountsList,
    AvailableCTraderAccountsList,
    AvailableDxtradeAccountsList,
    AvailableMT5AccountsList,
} from '../../flows';
import { TAddedMT5Account, TAvailableMT5Account } from '../../types';
import './CFDPlatformsListAccounts.scss';

const CFDPlatformsListAccounts: React.FC = () => {
    const {
        data: mt5AccountsList,
        isFetchedAfterMount: isMT5FetchedAfterMount,
        isLoading: isMT5Loading,
    } = useSortedMT5Accounts();
    const {
        data: ctraderAccountsList,
        isFetchedAfterMount: isCtraderFetchedAfterMount,
        isLoading: isCTraderLoading,
    } = useCtraderAccountsList();
    const {
        data: dxtradeAccountsList,
        isFetchedAfterMount: isDxtradeFetchedAfterMount,
        isLoading: isDxtradeLoading,
    } = useDxtradeAccountsList();
    const { data: landingCompany, isLoading: isLandingCompanyLoading } = useLandingCompany();

    const isLoading = isMT5Loading || isCTraderLoading || isDxtradeLoading || isLandingCompanyLoading;
    const isFetchedAfterMount = isMT5FetchedAfterMount || isCtraderFetchedAfterMount || isDxtradeFetchedAfterMount;

    const hasCTraderAccount = !!ctraderAccountsList?.length;
    const hasDxtradeAccount = !!dxtradeAccountsList?.length;

    const financialRestrictedCountry =
        landingCompany?.financial_company?.shortcode === 'svg' && !landingCompany?.gaming_company;
    const cfdRestrictedCountry =
        landingCompany?.gaming_company?.shortcode === 'svg' && !landingCompany.financial_company;
    const isRestricted = financialRestrictedCountry || cfdRestrictedCountry;

    if (isLoading || !isFetchedAfterMount) {
        return (
            <div className='wallets-cfd-list-accounts__content'>
                {Array.from({ length: 3 }).map((_, idx) => (
                    <TradingAppCardLoader key={`wallets-carousel-loader-action-${idx}`} />
                ))}
            </div>
        );
    }

    return (
        <div className='wallets-cfd-list-accounts__content'>
            {mt5AccountsList?.map((account, index) => {
                if (account.is_added)
                    return (
                        <AddedMT5AccountsList
                            account={account as TAddedMT5Account}
                            key={`added-mt5-list${(account as TAddedMT5Account).loginid}-${index}`}
                        />
                    );

                return (
                    <AvailableMT5AccountsList
                        account={account as TAvailableMT5Account}
                        key={`available-mt5-list${account.name}-${index}`}
                    />
                );
            })}
            {!isRestricted && (
                <>
                    {hasCTraderAccount ? <AddedCTraderAccountsList /> : <AvailableCTraderAccountsList />}
                    {hasDxtradeAccount ? <AddedDxtradeAccountsList /> : <AvailableDxtradeAccountsList />}
                </>
            )}
        </div>
    );
};

export default CFDPlatformsListAccounts;
