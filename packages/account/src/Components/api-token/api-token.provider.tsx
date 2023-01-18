import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { TApiContext, TToken } from 'Types';
import ApiTokenContext from './api-token-context';

const ApiTokenProvider = ({ children, ws }: { children: ReactNode; ws: any }) => {
    const [api_tokens, setApiTokens] = useState<TToken[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error_message, setErrorMessage] = useState<string>();

    const update_tokens = useCallback((token: TToken[]) => {
        setApiTokens(token);
    }, []);

    const toggle_loading = useCallback(() => {
        setLoading(prevState => !prevState);
    }, []);

    const update_error_message = useCallback((message: string) => {
        setErrorMessage(message);
    }, []);

    const value: TApiContext = useMemo(() => {
        return {
            error_message,
            update_error_message,
            api_tokens,
            loading,
            toggle_loading,
            update_tokens,
            ws,
        };
    }, [error_message, update_error_message, api_tokens, loading, toggle_loading, update_tokens, ws]);

    return <ApiTokenContext.Provider value={value}>{children}</ApiTokenContext.Provider>;
};

export default ApiTokenProvider;
