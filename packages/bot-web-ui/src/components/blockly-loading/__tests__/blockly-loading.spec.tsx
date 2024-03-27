import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { act, render, screen } from '@testing-library/react';
import RootStore from '../../../stores/root-store';
import { DBotStoreProvider, mockDBotStore } from '../../../stores/useDBotStore';
import BlocklyLoading from '../blockly-loading';

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

describe('BlocklyLoading', () => {
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
    it('should render BlocklyLoading', () => {
        const { container } = render(<BlocklyLoading />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    it('should not render BlocklyLoading loader', () => {
        render(<BlocklyLoading />, {
            wrapper,
        });
        expect(screen.queryByTestId('blockly-loader')).not.toBeInTheDocument();
    });

    it('should render BlocklyLoading loader', () => {
        act(() => {
            mock_DBot_store?.blockly_store?.setLoading(true);
        });
        render(<BlocklyLoading />, {
            wrapper,
        });
        expect(screen.getByTestId('blockly-loader')).toBeInTheDocument();
    });
});
