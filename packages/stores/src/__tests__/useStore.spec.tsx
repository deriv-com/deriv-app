import * as React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { StoreProvider, useStore } from '../useStore';
import { TRootStore } from '../../types';

describe('useStore', () => {
    test('should throw an error if StoreContext has not been provided', async () => {
        const { result } = renderHook(() => useStore());
        expect(result.error).toEqual(Error('useStore must be used within StoreContext'));
    });

    test('should be able to access store data if StoreContext has been provided', async () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            client: {
                email: 'john@company.com',
            },
            ui: {
                is_dark_mode_on: true,
            },
        };

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore as TRootStore}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useStore(), { wrapper });
        expect(result.current.client.email).toBe('john@company.com');
        expect(result.current.ui.is_dark_mode_on).toBe(true);
    });
});
