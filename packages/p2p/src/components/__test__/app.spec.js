import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../app';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => ({
        general_store: {
            onUnmount: jest.fn(),
            setAppProps: jest.fn(),
            setWebsocketInit: jest.fn(),
            redirectTo: jest.fn(),
            client: {
                local_currency_config: {
                    decimal_places: 1,
                },
            },
        },
        order_store: {
            setOrderId: jest.fn(),
        },
    })),
}));

jest.mock('Utils/websocket', () => ({
    waitWS: (...payload) => Promise.resolve([...payload]),
}));

jest.mock('Components/app-content', () => () => <div>AppContent</div>);

// jest.mock('Components/i18next', () => () => jest.fn());

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
        const spied_use_effect = jest.spyOn(React, 'useEffect');
        render(<App {...props} />);

        expect(spied_use_effect).toHaveBeenCalledTimes(1);
    });

    it('should render appContent component', () => {
        render(<App {...props} />);
        const el_app_content = screen.queryByText('AppContent');

        expect(el_app_content).toBeInTheDocument();
    });

    // it('should invoke setLanguage function');

    // it('should redirect to orders when order_id is passed', () => {
    //     const spied_redirectTo = jest
    //         .spyOn(useStores().general_store, 'redirectTo')
    //         .render(<App {...props} order_id='17' />);

    //     expect(spied_redirectTo).toHaveBeenCalled();
    // });
});
