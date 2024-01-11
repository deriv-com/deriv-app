import React from 'react';
import { render, screen } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useStores } from 'Stores/index';
import Routes from '../routes';

let mock_store: DeepPartial<ReturnType<typeof useStores>>;

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('Components/dp2p-blocked', () => jest.fn(() => <div>Dp2pBlocked</div>));
jest.mock('../binary-routes', () => jest.fn(() => <div>BinaryRoutes</div>));
jest.mock('../error-component.tsx', () => jest.fn(() => <div>ErrorComponent</div>));

describe('<Routes />', () => {
    const history = createBrowserHistory();

    const mock_root_store = mockStore({
        client: {
            is_logged_in: false,
            is_logging_in: false,
        },
    });

    const renderComponent = ({ store_config = mock_root_store }) =>
        render(
            <StoreProvider store={store_config}>
                <Router history={history}>
                    <Routes />
                </Router>
            </StoreProvider>
        );

    beforeEach(() => {
        mock_store = {
            general_store: {
                should_show_dp2p_blocked: false,
            },
        };
    });

    it('should show error messages when has_error is true', () => {
        const new_store = {
            ...mock_root_store,
            common: {
                ...mock_root_store.common,
                has_error: true,
            },
        };
        renderComponent({ store_config: new_store });

        expect(screen.getByText('ErrorComponent')).toBeInTheDocument();
    });

    it('should render BinaryRoutes component when has_error is false', () => {
        renderComponent({});

        expect(screen.getByText('BinaryRoutes')).toBeInTheDocument();
    });

    it('should render Dp2pBlocked component when should_show_dp2p_blocked is true', () => {
        mock_store.general_store.should_show_dp2p_blocked = true;
        renderComponent({});

        expect(screen.getByText('Dp2pBlocked')).toBeInTheDocument();
    });
});
