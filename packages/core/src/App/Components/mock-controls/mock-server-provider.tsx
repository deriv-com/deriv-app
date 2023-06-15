import React, { ReactNode } from 'react';
import { useWS } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';

export const SESSION_ID_KEY = 'session_id';

type MockServerData = {
    active_session_id: string;
    handleSetActiveSessionId: (session_id: string) => void;
};

const MockServerContext = React.createContext<MockServerData | null>(null);

type MockServerProviderProps = {
    children: ReactNode;
};

export const MockServerProvider = ({ children }: MockServerProviderProps) => {
    const WS = useWS();
    const [active_session_id, setActiveSessionId] = React.useState(localStorage.getItem(SESSION_ID_KEY) || '');

    React.useEffect(() => {
        if (active_session_id) {
            WS.closeAndOpenNewConnection(getLanguage(), active_session_id);
        }
    }, [active_session_id]);

    const handleSetActiveSessionId = (session_id: string) => {
        if (!session_id) return;
        window.localStorage.setItem(SESSION_ID_KEY, session_id);
        setActiveSessionId(session_id);
    };

    return (
        <MockServerContext.Provider value={{ active_session_id, handleSetActiveSessionId }}>
            {children}
        </MockServerContext.Provider>
    );
};

export const useMockServer = () => {
    const mock_server_contect = React.useContext(MockServerContext);
    if (!mock_server_contect) {
        throw new Error('useMockServer must be within UserDataProvider');
    }

    return mock_server_contect;
};
