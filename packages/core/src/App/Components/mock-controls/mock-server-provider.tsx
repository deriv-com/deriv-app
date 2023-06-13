import React, { ReactNode } from 'react';
import { useWS } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';

export const ACTIVE_MOCK_ID = 'mock_id';

type MockServerData = {
    active_mock_id: string;
    handleSetActiveMockId: (mock_id: string) => void;
};

const MockServerContext = React.createContext<MockServerData | null>(null);

type MockServerProviderProps = {
    children: ReactNode;
};

export const MockServerProvider = ({ children }: MockServerProviderProps) => {
    const WS = useWS();
    const [active_mock_id, setActiveMockId] = React.useState(localStorage.getItem('mock_id') || '');

    React.useEffect(() => {
        if (active_mock_id) {
            WS.closeAndOpenNewConnection(getLanguage(), active_mock_id);
        }
    }, [active_mock_id]);

    const handleSetActiveMockId = (mock_id: string) => {
        if (!mock_id) return;
        window.localStorage.setItem(ACTIVE_MOCK_ID, mock_id);
        setActiveMockId(mock_id);
    };

    return (
        <MockServerContext.Provider value={{ active_mock_id, handleSetActiveMockId }}>
            {children}
        </MockServerContext.Provider>
    );
};

export const useMockServer = () => {
    const mock_server_contect = React.useContext(MockServerContext);
    if (!mock_server_contect) {
        throw new Error('useUserData must be within UserDataProvider');
    }

    return mock_server_contect;
};
