import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import * as React from 'react';
import useMFAccountStatus from '../useMFAccountStatus';
import useContentFlag from '../useContentFlag';
import useHasMaltaInvestAccount from '../useHasMaltaInvestAccount';
import useGetMFAccountStatus from '../useGetMFAccountStatus';

jest.mock('../useContentFlag', () => jest.fn());
jest.mock('../useHasMaltaInvestAccount', () => jest.fn());
jest.mock('../useGetMFAccountStatus', () => jest.fn());

const mockUseContentFlag = useContentFlag as jest.MockedFunction<typeof useContentFlag>;
const mockUseHasMaltaInvestAccount = useHasMaltaInvestAccount as jest.MockedFunction<typeof useHasMaltaInvestAccount>;
const mockUseGetMFAccountStatus = useGetMFAccountStatus as jest.MockedFunction<typeof useGetMFAccountStatus>;

describe('useMFAccountStatus', () => {
    const wrapper = ({ children }: { children: JSX.Element }) => (
        <StoreProvider store={mockStore({})}>{children}</StoreProvider>
    );
    it('should return mf_status if conditions are met', () => {
        mockUseContentFlag.mockReturnValue({
            is_low_risk_cr_eu: true,
            is_eu_real: false,
            is_low_risk_cr_non_eu: false,
            is_high_risk_cr: false,
            is_cr_demo: false,
            is_eu_demo: false,
        });
        mockUseHasMaltaInvestAccount.mockReturnValue(true);
        mockUseGetMFAccountStatus.mockReturnValue('needs_verification');
        const { result } = renderHook(() => useMFAccountStatus(), {
            wrapper,
        });
        expect(result.current).toBe('needs_verification');
    });
    it('should return null if conditions are not met', () => {
        mockUseContentFlag.mockReturnValue({
            is_low_risk_cr_eu: false,
            is_eu_real: false,
            is_low_risk_cr_non_eu: false,
            is_high_risk_cr: false,
            is_cr_demo: false,
            is_eu_demo: false,
        });
        mockUseHasMaltaInvestAccount.mockReturnValue(false);
        mockUseGetMFAccountStatus.mockReturnValue('needs_verification');
        const { result } = renderHook(() => useMFAccountStatus(), {
            wrapper,
        });
        expect(result.current).toBe(null);
    });
});
