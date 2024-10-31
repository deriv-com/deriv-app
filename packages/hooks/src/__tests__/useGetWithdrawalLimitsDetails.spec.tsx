import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { getWithdrawalInfoMessage, getWithdrawalTitle } from '@deriv/shared';
import { mockStore, StoreProvider } from '@deriv/stores';
import useGetWithdrawalLimitsDetails from '../useGetWithdrawalLimitsDetails';

jest.mock('@deriv/shared', () => ({
    getWithdrawalInfoMessage: jest.fn(),
    getWithdrawalTitle: jest.fn(),
}));

describe('useGetWithdrawalLimitsDetails', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mock = mockStore({
        client: {
            account_limits: {
                lifetime_limit: 10000,
                num_of_days_limit: 30,
                withdrawal_since_inception_monetary: 5000,
                withdrawal_for_x_days_monetary: 2000,
                remainder: 5000,
                num_of_days: 30,
            },
        },
    });
    const wrapper = ({ children }: { children: JSX.Element }) => <StoreProvider store={mock}>{children}</StoreProvider>;

    it('should return withdrawal limit details', () => {
        (getWithdrawalTitle as jest.Mock).mockImplementation(type => `Title for ${type}`);
        (getWithdrawalInfoMessage as jest.Mock).mockImplementation(type => `Info for ${type}`);

        const { result } = renderHook(() => useGetWithdrawalLimitsDetails(), { wrapper });

        expect(result.current.withdrawal_limit_details).toEqual([
            {
                withdrawal_title: 'Title for lifetime_limit',
                withdrawal_info_message: 'Info for lifetime_limit',
                withdrawal_amount: 10000,
            },
            {
                withdrawal_title: 'Title for num_of_days_limit',
                withdrawal_info_message: 'Info for num_of_days_limit',
                withdrawal_amount: 30,
            },
            {
                withdrawal_title: 'Title for withdrawal_since_inception_monetary',
                withdrawal_info_message: 'Info for withdrawal_since_inception_monetary',
                withdrawal_amount: 5000,
            },
            {
                withdrawal_title: 'Title for withdrawal_for_x_days_monetary',
                withdrawal_info_message: 'Info for withdrawal_for_x_days_monetary',
                withdrawal_amount: 2000,
            },
            {
                withdrawal_title: 'Title for remainder',
                withdrawal_info_message: 'Info for remainder',
                withdrawal_amount: 5000,
            },
        ]);

        expect(getWithdrawalTitle).toHaveBeenCalledTimes(5);
        expect(getWithdrawalInfoMessage).toHaveBeenCalledTimes(5);
    });

    it('should filter out details with withdrawal_amount of 99999999', () => {
        mock.client.account_limits.lifetime_limit = 99999999;
        mock.client.account_limits.withdrawal_for_x_days_monetary = 99999999;

        (getWithdrawalTitle as jest.Mock).mockImplementation(type => `Title for ${type}`);
        (getWithdrawalInfoMessage as jest.Mock).mockImplementation(type => `Info for ${type}`);

        const { result } = renderHook(() => useGetWithdrawalLimitsDetails(), { wrapper });

        expect(result.current.withdrawal_limit_details).toHaveLength(3);
        expect(result.current.withdrawal_limit_details).not.toContainEqual(
            expect.objectContaining({ withdrawal_amount: 99999999 })
        );
    });
});
