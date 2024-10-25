import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import * as React from 'react';
import useMFAccountStatus from '../useMFAccountStatus';
import useHasMaltaInvestAccount from '../useHasMaltaInvestAccount';
import useGetMFAccountStatus from '../useGetMFAccountStatus';

jest.mock('../useHasMaltaInvestAccount', () => jest.fn());
jest.mock('../useGetMFAccountStatus', () => jest.fn());

const mockUseHasMaltaInvestAccount = useHasMaltaInvestAccount as jest.MockedFunction<typeof useHasMaltaInvestAccount>;
const mockUseGetMFAccountStatus = useGetMFAccountStatus as jest.MockedFunction<typeof useGetMFAccountStatus>;

describe('useMFAccountStatus', () => {
    let mock_store = mockStore({});
    const wrapper = ({ children }: { children: JSX.Element }) => (
        <StoreProvider store={mock_store}>{children}</StoreProvider>
    );
    beforeEach(() => (mock_store = mockStore({})));
    it('should return mf_status if conditions are met', () => {
        mock_store.client.is_eu = true;
        mockUseHasMaltaInvestAccount.mockReturnValue(true);
        mockUseGetMFAccountStatus.mockReturnValue('needs_verification');
        const { result } = renderHook(() => useMFAccountStatus(), {
            wrapper,
        });
        expect(result.current).toBe('needs_verification');
    });
    it('should return null if conditions are not met', () => {
        mockUseHasMaltaInvestAccount.mockReturnValue(false);
        mockUseGetMFAccountStatus.mockReturnValue('needs_verification');
        const { result } = renderHook(() => useMFAccountStatus(), {
            wrapper,
        });
        expect(result.current).toBe(null);
    });
});
