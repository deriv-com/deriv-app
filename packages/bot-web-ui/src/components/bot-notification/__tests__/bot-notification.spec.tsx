import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import RootStore from '../../../stores/root-store';
import { DBotStoreProvider, mockDBotStore } from '../../../stores/useDBotStore';
import BotNotification from '../bot-notification';

jest.mock('react-toastify/dist/ReactToastify.css', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());
jest.mock('@deriv/deriv-charts', () => ({
    setSmartChartsPublicPath: jest.fn(),
}));

const mock_ws = {
    authorized: {
        subscribeProposalOpenContract: jest.fn(),
        send: jest.fn(),
    },
    storage: {
        send: jest.fn(),
    },
    contractUpdate: jest.fn(),
    subscribeTicksHistory: jest.fn(),
    forgetStream: jest.fn(),
    activeSymbols: jest.fn(),
    send: jest.fn(),
};

jest.useFakeTimers();

describe('BotNotification', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;

    beforeAll(() => {
        const mock_store = mockStore({});
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });
    it('should render BotNotification with correct message', () => {
        const { container } = render(<BotNotification />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });
});
