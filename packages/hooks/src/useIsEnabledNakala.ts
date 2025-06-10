import { useEffect, useState } from 'react';
import axios from 'axios';

import useGrowthbookGetFeatureValue from './useGrowthbookGetFeatureValue';

const useIsEnabledNakala = (loginId: string | undefined) => {
    const [nakalaServerInfo, setNakalaServerInfo] = useState(null);

    useEffect(() => {
        getNakalaServerInfo();
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
            console.error('Error fetching Nakala server info:', error);
        }
    };

    return { IsEnabledNakala: is_nakala_enabled, nakalaServerInfo };
};

export default useIsEnabledNakala;
