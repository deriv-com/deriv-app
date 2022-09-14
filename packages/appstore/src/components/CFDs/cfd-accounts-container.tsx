import React from 'react';
import CFDDemoAccounts from './cfd-demo-accounts';
import CFDRealAccounts from './cfd-real-accounts';
import { isLandingCompanyEnabled } from '@deriv/shared';
import { Loading } from '@deriv/components';
import { TPlatform, TAccountCategory } from 'Types';
import { useStores } from 'Stores/index';

type TCFDAccountsProps = {
    account_type: TAccountCategory;
};

const CFDAccounts = ({ account_type }: TCFDAccountsProps) => {
    const { client, cfd_account } = useStores();
    const {
        is_eu,
        is_eu_country,
        landing_companies,
        is_logged_in,
        is_populating_mt5_account_list: is_loading,
    } = client;
    const { current_list } = cfd_account;

    const isDerivedVisible = (platform: TPlatform) => {
        const has_synthetic_account = Object.keys(current_list).some(key =>
            key.startsWith(`${platform}.${account_type}.synthetic`)
        );
        // Hiding card for logged out EU users
        if (!is_logged_in && is_eu_country) return false;

        if (is_eu && !has_synthetic_account) return false;

        return isLandingCompanyEnabled({ landing_companies, platform, type: 'gaming' }) || !is_logged_in;
    };

    const isFinancialVisible = (platform: TPlatform) => {
        // will change the logic later
        return true;
    };

    const isDerivXVisible = (platform: TPlatform) => {
        // will change the logic later
        return true;
    };

    return is_loading ? (
        <Loading full_screen className='cfd-accounts-container-loader' />
    ) : (
        <div className='cfd-accounts-container'>
            {account_type === 'demo' ? (
                <CFDDemoAccounts
                    isDerivedVisible={isDerivedVisible}
                    isFinancialVisible={isFinancialVisible}
                    isDerivXVisible={isDerivXVisible}
                />
            ) : (
                <CFDRealAccounts
                    isDerivedVisible={isDerivedVisible}
                    isFinancialVisible={isFinancialVisible}
                    isDerivXVisible={isDerivXVisible}
                />
            )}
        </div>
    );
};

export default CFDAccounts;
