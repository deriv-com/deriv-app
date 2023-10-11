import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { useCashierStore } from '../../../../stores/useCashierStores';
import userEvent from '@testing-library/user-event';
import Real from '../real';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: () => <div>Loading</div>,
}));

let mocked_cashier_store: DeepPartial<ReturnType<typeof useCashierStore>>;

jest.mock('Stores/useCashierStores', () => ({
    ...jest.requireActual('Stores/useCashierStores'),
    useCashierStore: jest.fn(() => mocked_cashier_store),
}));

describe('<Real />', () => {
    beforeEach(() => {
        mocked_cashier_store = {
            iframe: {
                clearIframe: jest.fn(),
                iframe_height: 100,
                iframe_url: 'https://www.test_url.com',
                checkIframeLoaded: jest.fn(),
                setContainerHeight: jest.fn(),
            },
            general_store: {
                is_loading: false,
            },
        };
    });

    const mock_root_store = mockStore({});

    it('should show loader when is_loading is true or iframe_height is equal to 0', () => {
        (useCashierStore as jest.Mock).mockReturnValueOnce({
            ...mocked_cashier_store,
            iframe: { ...mocked_cashier_store.iframe, iframe_height: 0 },
        });

        const { rerender } = render(
            <StoreProvider store={mock_root_store}>
                <Real />
            </StoreProvider>
        );

        expect(screen.getByText('Loading')).toBeInTheDocument();

        (useCashierStore as jest.Mock).mockReturnValueOnce({
            ...mocked_cashier_store,
            general_store: { is_loading: true },
        });

        rerender(
            <StoreProvider store={mock_root_store}>
                <Real />
            </StoreProvider>
        );

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('should render an iframe if iframe_url is not an empty string', () => {
        render(
            <StoreProvider store={mock_root_store}>
                <Real />
            </StoreProvider>
        );

        expect(screen.queryByTestId('dt_doughflow_section')).toBeInTheDocument();
    });

    it('should trigger setIsDeposit callback when the user clicks on Cashier breadcrumb', () => {
        render(
            <StoreProvider store={mock_root_store}>
                <Real />
            </StoreProvider>
        );

        const el_breadcrumb_cashier = screen.queryByText(/cashier/i);

        if (el_breadcrumb_cashier) {
            userEvent.click(el_breadcrumb_cashier);
            expect(mocked_cashier_store.general_store?.setIsDeposit).toHaveBeenCalledWith(false);
        }
    });
});
