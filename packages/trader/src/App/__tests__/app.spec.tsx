import React from 'react';
import { render } from '@testing-library/react';
import App from '../app';
import { mockStore } from '@deriv/stores';
import moment from 'moment';
import { TStores } from '@deriv/stores/types';

const root_store = {
    ...mockStore({}),
    common: {
        ...mockStore({}).common,
        server_time: moment(new Date()).utc(),
    },
    client: {
        ...mockStore({}).client,
        is_landing_company_loaded: true,
        is_logged_in: false,
    },
    modules: {
        ...mockStore({}).modules,
        cashier: {
            general_store: {
                onMountCommon: jest.fn(),
                setAccountSwitchListener: jest.fn(),
            },
        },
    },
};

const mock_ws = {
    activeSymbols: jest.fn(),
    authorized: {
        activeSymbols: jest.fn(),
        subscribeProposalOpenContract: jest.fn(),
        send: jest.fn(),
    },
    buy: jest.fn(),
    storage: {
        contractsFor: jest.fn(),
        send: jest.fn(),
    },
    contractUpdate: jest.fn(),
    contractUpdateHistory: jest.fn(),
    subscribeTicksHistory: jest.fn(),
    forgetStream: jest.fn(),
    forget: jest.fn(),
    forgetAll: jest.fn(),
    send: jest.fn(),
    subscribeProposal: jest.fn(),
    subscribeTicks: jest.fn(),
    time: jest.fn(),
    tradingTimes: jest.fn(),
    wait: jest.fn(),
};

jest.mock('App/Containers/Routes/routes', () => jest.fn(() => <div>Router</div>));
jest.mock('App/Containers/trade-footer-extensions', () => jest.fn(() => <div>TradeFooterExtensions</div>));

describe('App', () => {
    it('should render the app component', () => {
        const { container } = render(
            <App
                passthrough={{
                    root_store: root_store as TStores,
                    WS: mock_ws,
                }}
            />
        );
        expect(container).toBeInTheDocument();
    });

    it('should call setPromptHandler on unmount', () => {
        const setPromptHandler = jest.fn();
        root_store.ui.setPromptHandler = setPromptHandler;
        const { unmount } = render(
            <App
                passthrough={{
                    root_store: root_store as TStores,
                    WS: mock_ws,
                }}
            />
        );
        unmount();
        expect(setPromptHandler).toHaveBeenCalledWith(false);
    });
});
