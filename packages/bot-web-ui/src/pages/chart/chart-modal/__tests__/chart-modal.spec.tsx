import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen, waitFor } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import ChartModal from '..';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));

jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

jest.mock('../chart-modal-desktop', () => ({
    __esModule: true,
    default: () => <div>Desktop Chart Modal</div>,
}));

jest.mock('@deriv/deriv-charts', () => ({
    setSmartChartsPublicPath: jest.fn(),
}));

describe('ChartModal', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    const wrapper = (mock_store: ReturnType<typeof mockStore>) => {
        const mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        const Component = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );

        return Component;
    };

    it('should render Desktop component based on Desktop', async () => {
        const mock_store = mockStore({
            ui: {
                is_desktop: true,
            },
        });

        await waitFor(() => render(<ChartModal />, { wrapper: wrapper(mock_store) }));

        expect(screen.queryByText('Desktop Chart Modal')).toBeInTheDocument();
    });

    it('should render Mobile version without Chart Modal', async () => {
        const mock_store = mockStore({
            ui: {
                is_desktop: false,
            },
        });

        await waitFor(() => render(<ChartModal />, { wrapper: wrapper(mock_store) }));

        expect(screen.queryByText('Desktop Chart Modal')).not.toBeInTheDocument();
    });
});
