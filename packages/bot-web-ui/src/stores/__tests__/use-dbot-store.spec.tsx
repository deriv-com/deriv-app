import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { DBotStoreProvider, mockDBotStore, useDBotStore } from 'Stores/useDBotStore';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { renderHook } from '@testing-library/react-hooks';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({}));

jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

describe('useDBotStore', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;

    it('UseDBotStore should return the store if used inside DBotStoreProvider', () => {
        const mock_store = mockStore({});
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );

        const { result } = renderHook(() => useDBotStore(), { wrapper });

        expect(result.current).toBeTruthy();
    });

    it('UseDBotStore should throw error if used outside of DBotStoreProvider', () => {
        const { result } = renderHook(() => useDBotStore());

        expect(result.error).toEqual(new Error('useDBotStore must be used within DBotStoreProvider'));
    });
});
