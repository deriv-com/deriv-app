/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import axios from 'axios';

import useGrowthbookGetFeatureValue from './useGrowthbookGetFeatureValue';

const useIsEnabledNakala = (accounts: any[]) => {
    const getMT5Account = (accounts: any[]) => {
        if (!accounts?.length) return null;

        // Priority: svg > vanuatu > bvi
        const priorityOrder = ['svg', 'vanuatu', 'bvi'];

        const account = priorityOrder.reduce((found, company) => {
            if (found) return found;
            return accounts.find(
                acc => acc.landing_company_name?.toLowerCase() === company || acc.landing_company_short === company
            );
        }, null);
        if (account) return account;

        return accounts[0]; // fallback to first account if no priority match
    };

    const selectedAccount = getMT5Account(accounts);
    const loginId = selectedAccount?.display_login || '';

    const [nakalaServerInfo, setNakalaServerInfo] = useState(null);

    useEffect(() => {
        loginId != '' && getNakalaServerInfo();
    }, [loginId]);

    const [is_nakala_enabled] = useGrowthbookGetFeatureValue({
        featureFlag: 'is_nakala_enabled',
    });

    const getNakalaServerInfo = async () => {
        try {
            const response = await axios.get(
                `https://deriv-app.xano.io/api:V98H-ia9:nakala/nakala_servers?mt5_login_id=${loginId}`
            );
            setNakalaServerInfo(response.data?.server_name);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error fetching Nakala server info:', error);
        }
    };

    return { IsEnabledNakala: is_nakala_enabled, nakalaServerInfo, loginId };
};

export default useIsEnabledNakala;
