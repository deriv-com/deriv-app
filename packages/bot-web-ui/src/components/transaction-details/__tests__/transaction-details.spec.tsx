import React from 'react';
import { isMobile } from '@deriv/shared';
import { mockStore, StoreProvider } from '@deriv/stores';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen, waitFor } from '@testing-library/react';
import RootStore from 'Stores/index';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import TransactionDetails from '../transaction-details';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(),
}));

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

jest.mock('../transaction-details-desktop', () => ({
    __esModule: true,
    default: () => <div>Desktop Details</div>,
}));

jest.mock('../transaction-details-mobile', () => ({
    __esModule: true,
    default: () => <div>Mobile Details</div>,
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
describe('TransactionDetails', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;

    beforeEach(() => {
        jest.resetModules();
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

    it('should render Desktop component based on Desktop', async () => {
        (isMobile as jest.Mock).mockReturnValueOnce(false);
        await waitFor(() => render(<TransactionDetails />, { wrapper }));
        expect(screen.queryByText('Desktop Details')).toBeInTheDocument();
    });

    it('should render Mobile component on mobile', async () => {
        (isMobile as jest.Mock).mockReturnValueOnce(true);
        await waitFor(() => render(<TransactionDetails />, { wrapper }));
        expect(screen.getByText('Mobile Details')).toBeInTheDocument();
    });
});
