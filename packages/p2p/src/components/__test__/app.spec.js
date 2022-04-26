import React from 'react';
import { render, screen } from '@testing-library/react';
import { routes } from '@deriv/shared';
import { createBrowserHistory } from 'history';
import { useStores } from 'Stores';
import { setLanguage } from '../i18next';
import App from '../app.jsx';
import ServerTime from 'Utils/server-time';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn().mockReturnValue({
        general_store: {
            onUnmount: jest.fn(),
            setAppProps: jest.fn(),
            setWebsocketInit: jest.fn(),
            redirectTo: jest.fn(),
            onMount: jest.fn(),
            client: {
                local_currency_config: {
                    decimal_places: 1,
                },
            },
            path: {
                my_ads: null,
            },
        },
        order_store: {
            setOrderId: jest.fn(),
        },
    }),
}));

jest.mock('Utils/websocket', () => ({
    waitWS: (...payload) => Promise.resolve([...payload]),
}));

jest.mock('Utils/server-time', () => ({
    init: jest.fn(),
    get: jest.fn(),
    getDistanceToServerTime: jest.fn(),
}));

jest.mock('Components/app-content.jsx', () => jest.fn(() => <div>AppContent</div>));

jest.mock('Components/i18next', () => ({
    ...jest.requireActual('Components/i18next'),
    setLanguage: jest.fn(),
}));

describe('<App/>', () => {
    const props = {
        client: {
            currency: 'USD',
            is_virtual: false,
            local_currency_config: { currency: 'USD' },
            loginid: 'test',
            residence: 'IND',
        },
        modal_root_id: '123',
        websocket_api: {},
    };

    it('should set store props when rendered for the first time', () => {
        const { general_store, order_store } = useStores();
        render(<App {...props} order_id='17' />);

        expect(general_store.setAppProps).toHaveBeenCalled();
        expect(general_store.setWebsocketInit).toHaveBeenCalled();
        expect(order_store.setOrderId).toHaveBeenCalledWith('17');
        expect(general_store.redirectTo).toHaveBeenCalled();
        expect(ServerTime.init).toHaveBeenCalled();
    });

    it('should render appContent component', () => {
        render(<App {...props} />);

        expect(screen.getByText('AppContent')).toBeInTheDocument();
    });

    it('should invoke setLanguage function when component renders', () => {
        render(<App {...props} lang='ENG' />);

        expect(setLanguage).toHaveBeenCalledWith('ENG');
    });

    it('should redirect to p2p if route is /verification', () => {
        const set_item_spy = jest.spyOn(Object.getPrototypeOf(localStorage), 'setItem');
        const history = createBrowserHistory();
        const mock_history = { ...history, location: { pathname: '/verification' } };
        render(<App {...props} history={mock_history} />);

        expect(set_item_spy).toHaveBeenCalled();
        expect(history.location.pathname).toBe(routes.cashier_p2p);
    });

    it('should do a hard reload of page', () => {
        const window_spy = jest.spyOn(window, 'onpageshow', 'set');
        render(<App {...props} />);

        expect(window_spy).toHaveBeenCalled();
    });
});
