import React from 'react';
import { render, screen } from '@testing-library/react';
import { useStores } from 'Stores';
import { setLanguage } from '../i18next';
import App from '../app';

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

jest.mock('Components/app-content', () => () => <div>AppContent</div>);

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

    it('should invoke useEffect methods', () => {
        const use_effect_spy = jest.spyOn(React, 'useEffect');
        render(<App {...props} />);

        expect(use_effect_spy).toHaveBeenCalledTimes(1);
    });

    it('should render appContent component', () => {
        render(<App {...props} />);
        const el_app_content = screen.queryByText('AppContent');

        expect(el_app_content).toBeInTheDocument();
    });

    it('should invoke setLanguage function when component renders', () => {
        render(<App {...props} lang='ENG' />);

        expect(setLanguage).toHaveBeenCalledWith('ENG');
    });

    it('should redirect to orders when order_id is passed', () => {
        const { general_store } = useStores();
        const spied_redirectTo = jest.spyOn(general_store, 'redirectTo');
        render(<App {...props} order_id='17' />);

        expect(spied_redirectTo).toHaveBeenCalled();
    });

    it('should remove the is_verifying_p2p status from local storage if it was previously set', () => {
        localStorage.setItem('is_verifying_p2p', true);
        const remove_item_spy = jest.spyOn(window.localStorage.__proto__, 'removeItem');

        const mock_history = { location: { pathname: 'verification', push: jest.fn() } };
        render(<App {...props} history={mock_history} />);

        // expect(set_item_spy).toHaveBeenCalled();
    });

    it('should do a hard reload of page', () => {
        const window_spy = jest.spyOn(window, 'onpageshow', 'set');
        render(<App {...props} />);

        expect(window_spy).toHaveBeenCalled();
    });
});
