import React from 'react';
import { render, screen } from '@testing-library/react';
import { APIProvider, useRequest } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';
import DemoResetBalance from '../demo-reset-balance';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useRequest: jest.fn(),
}));

const mockUseRequest = useRequest as jest.MockedFunction<typeof useRequest<'topup_virtual'>>;

describe('<DemoResetBalance />', () => {
    it('should render', () => {
        const mock = mockStore({});
        // @ts-expect-error need to come up with a way to mock the return type of useRequest
        mockUseRequest.mockReturnValue({});
        const setActiveTabIndex = jest.fn();

        render(<DemoResetBalance setActiveTabIndex={setActiveTabIndex} />, {
            wrapper: ({ children }) => (
                <StoreProvider store={mock}>
                    <APIProvider>{children}</APIProvider>
                </StoreProvider>
            ),
        });

        expect(screen.getByText('Reset balance to 10,000.00 USD')).toBeInTheDocument();
        expect(
            screen.getByText('Reset your virtual balance if it falls below 10,000.00 USD or exceeds 10,000.00 USD.')
        ).toBeInTheDocument();
        expect(screen.getByText('Reset balance')).toBeInTheDocument();
    });

    // it('should show success message if reset balance is reset successfully', () => {

    // });
});
