import { useCallback } from 'react';
import { getPropertyValue } from '@deriv/shared';
import useApiTokenContext from './use-api-context';
import type { APITokenResponse } from '@deriv/api-types';
import { IFormValues } from 'Types';

const selectedTokenScope = (values: IFormValues) =>
    Object.keys(values).filter(item => item !== 'token_name' && values[item]);

const useApiToken = () => {
    const { update_error_message, update_tokens, ws } = useApiTokenContext();

    const getApiTokens = useCallback(async () => {
        try {
            const response: APITokenResponse = await ws.authorized?.apiToken({ api_token: 1 });
            update_tokens(getPropertyValue(response, ['api_token', 'tokens']));
        } catch (error) {
            update_error_message(getPropertyValue(error, ['error', 'message']));
        }
    }, [update_tokens, update_error_message, ws]);

    const deleteApiToken = useCallback(
        async (token: string, onFinished: () => void) => {
            const response: APITokenResponse = await ws.authorized.apiToken({ api_token: 1, delete_token: token });
            if (response.error) {
                update_error_message(getPropertyValue(response, ['error', 'message']));
            } else {
                update_tokens(getPropertyValue(response, ['api_token', 'tokens']));
            }
            onFinished();
        },
        [update_tokens, update_error_message, ws.authorized]
    );

    const requestAddToken = useCallback(
        async (token: IFormValues, onFinished: (response: APITokenResponse) => void) => {
            const response: APITokenResponse = await ws.apiToken({
                api_token: 1,
                new_token: token.token_name,
                new_token_scopes: selectedTokenScope(token),
            });
            update_tokens(getPropertyValue(response, ['api_token', 'tokens']));
            onFinished(response);
        },
        [update_tokens, ws]
    );

    return {
        getApiTokens,
        deleteApiToken,
        requestAddToken,
    };
};

export default useApiToken;
