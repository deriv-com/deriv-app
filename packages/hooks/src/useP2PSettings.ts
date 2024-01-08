import { useContext } from 'react';
import { P2PSettingsContext } from '@deriv/stores';

/**
 * A custom hook to get the p2p_settings information from `p2p_settings` endpoint
 */
const useP2PSettings = () => {
    const context = useContext(P2PSettingsContext);

    if (!context) {
        throw new Error('useP2PSettingsContext must be used within a P2PSettingsProvider');
    }

    return context;
};

export default useP2PSettings;
