import * as React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useCheck10kLimit from '../useCheck10kLimit';
import useMaxWithdrawAmount from '../useMaxWithdrawAmount';

jest.mock('../useMaxWithdrawAmount');

describe('useCheck10kLimit', () => {
    test('should be false if useMaxWithdrawAmount is undefined', async () => {
        (useMaxWithdrawAmount as jest.Mock).mockReturnValue('undefined');
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockStore({})}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useCheck10kLimit(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should be false if useMaxWithdrawAmount is bigger than min_withdrawal', async () => {
        (useMaxWithdrawAmount as jest.Mock).mockReturnValue(100);

        const mockRootStore = mockStore({
            client: {
                min_withdrawal: 10,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useCheck10kLimit(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should be true if useMaxWithdrawAmount is lower than min_withdrawal', async () => {
        (useMaxWithdrawAmount as jest.Mock).mockReturnValue(10);

        const mockRootStore = mockStore({
            client: {
                min_withdrawal: 100,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useCheck10kLimit(), { wrapper });

        expect(result.current).toBe(true);
    });
});
