import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
// eslint-disable-next-line import/no-extraneous-dependencies
import { act, render, screen } from '@testing-library/react';
import RootStore from 'Stores/index';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import ChartModalDesktop from '../chart-modal/chart-modal-desktop';
import { mock_ws } from 'Utils/mock';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
}));

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));

jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());
jest.mock('@deriv/deriv-charts', () => ({
    setSmartChartsPublicPath: jest.fn(),
}));

jest.mock('../../../chart', () => ({
    __esModule: true,
    default: () => <div>Mocked Chart component</div>,
}));

describe('ChartModalDesktop', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;

    beforeAll(() => {
        const mock_store = mockStore({});
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        mock_DBot_store?.dashboard?.setChartModalVisibility();

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render ChartModalDesktop', () => {
        render(<ChartModalDesktop />, {
            wrapper,
        });

        const chart_modal_dialog = screen.queryByText('Mocked Chart component');

        expect(chart_modal_dialog).toBeInTheDocument();
    });

    it('should show ChartModalDesktop modal after resizing screen', async () => {
        const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

        render(<ChartModalDesktop />, {
            wrapper,
        });

        const resizeEvent = new Event('resize');
        Object.defineProperty(window, 'innerWidth', { value: 80000 });
        Object.defineProperty(window, 'innerHeight', { value: 6000 });

        act(() => {
            window.dispatchEvent(resizeEvent);
        });

        const draggable_element = await screen.findByTestId('react-rnd-wrapper');
        const computedStyle = window.getComputedStyle(draggable_element);
        const transformValue = computedStyle.getPropertyValue('transform');

        expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
        expect(transformValue).toBe('translate(0px,0px)');

        addEventListenerSpy.mockRestore();

        const chart_modal_dialog = screen.queryByTestId('chart-modal-dialog');
        expect(chart_modal_dialog).toBeInTheDocument();
    });
});
