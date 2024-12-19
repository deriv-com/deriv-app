import React from 'react';
import { screen, render, act } from '@testing-library/react';
import ActiveSymbolsList from '../active-symbols-list';
import TraderProviders from '../../../../trader-providers';
import { TCoreStores } from '@deriv/stores/types';
import { mockStore } from '@deriv/stores';
import { TRADE_TYPES } from '@deriv/shared';
import userEvent from '@testing-library/user-event';
import useGuideStates from 'AppV2/Hooks/useGuideStates';

const input_placeholder_text = 'Search markets on Rise/Fall';
const symbol_search_results = 'MockedSymbolSearchResults';
const market_categories = 'MockedMarketCategories';

jest.mock('AppV2/Components/SymbolSearchResults', () => jest.fn(() => <div>{symbol_search_results}</div>));
jest.mock('AppV2/Components/MarketCategories', () => jest.fn(() => <div>{market_categories}</div>));

jest.mock('AppV2/Components/OnboardingGuide/GuideForPages/guide-container', () => ({
    __esModule: true,
    default: jest.fn(({ should_run, callback }) => (
        <div data-testid='mock-guide-container' data-should-run={should_run}>
            <button onClick={callback} data-testid='guide-callback-button'>
                Close Guide
            </button>
        </div>
    )),
}));

jest.mock('AppV2/Hooks/useGuideStates', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        guideStates: {
            should_run_market_selector_guide: false,
        },
        setGuideState: jest.fn(),
    })),
}));

jest.mock('AppV2/Hooks/useActiveSymbols', () => ({
    ...jest.requireActual('AppV2/Hooks/useActiveSymbols'),
    __esModule: true,
    default: jest.fn(() => ({
        activeSymbols: [],
    })),
}));

describe('<ActiveSymbolsList />', () => {
    const mocked_props = {
        isOpen: true,
        setIsOpen: jest.fn(),
    };
    let default_mock_store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        default_mock_store = mockStore({
            modules: {
                trade: {
                    symbol: '1H100Z',
                    contract_type: TRADE_TYPES.RISE_FALL,
                    setTickData: jest.fn(),
                    setDigitStats: jest.fn(),
                },
            },
        });
    });

    const MockActiveSymbolsList = (mocked_store: TCoreStores) => {
        return (
            <TraderProviders store={mocked_store}>
                <ActiveSymbolsList {...mocked_props} />
            </TraderProviders>
        );
    };
    it('renders SymbolsSearchField component with MarketCategories if user is not searching', () => {
        render(MockActiveSymbolsList(default_mock_store));

        expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', input_placeholder_text);
        expect(screen.getByText(market_categories)).toBeInTheDocument();
        expect(screen.queryByText(symbol_search_results)).not.toBeInTheDocument();
    });
    it('renders SymbolsSearchField component with MockedSymbolSearchResults if user is searching', async () => {
        render(MockActiveSymbolsList(default_mock_store));

        const search_input = screen.getByRole('textbox');
        expect(search_input).toHaveAttribute('placeholder', input_placeholder_text);
        expect(screen.getByText(market_categories)).toBeInTheDocument();

        await userEvent.type(search_input, 'some_symbol');
        expect(screen.getByText(symbol_search_results)).toBeInTheDocument();
        expect(screen.queryByText(market_categories)).not.toBeInTheDocument();
    });
    it('calls setTickData and setDigitStats on mount and on symbol change', () => {
        const updated_store = mockStore({
            modules: {
                trade: {
                    symbol: 'mock_symbol',
                    contract_type: TRADE_TYPES.RISE_FALL,
                    setTickData: jest.fn(),
                    setDigitStats: jest.fn(),
                },
            },
        });
        const { rerender } = render(MockActiveSymbolsList(default_mock_store));
        expect(default_mock_store.modules.trade.setTickData).toBeCalledWith(null);
        expect(default_mock_store.modules.trade.setDigitStats).toBeCalledWith([]);

        rerender(MockActiveSymbolsList(updated_store));
        expect(default_mock_store.modules.trade.setTickData).toBeCalledWith(null);
        expect(default_mock_store.modules.trade.setDigitStats).toBeCalledWith([]);
    });
    it('should show guide when should_run_market_selector_guide is true and component is open', () => {
        (useGuideStates as jest.Mock).mockReturnValue({
            guideStates: {
                should_run_market_selector_guide: true,
            },
            setGuideState: jest.fn(),
        });

        render(MockActiveSymbolsList(default_mock_store));

        act(() => {
            jest.advanceTimersByTime(300);
        });

        const guideContainer = screen.getByTestId('mock-guide-container');
        expect(guideContainer).toBeInTheDocument();
    });
    it('should not show guide when should_run_market_selector_guide is false', () => {
        (useGuideStates as jest.Mock).mockReturnValue({
            guideStates: {
                should_run_market_selector_guide: false,
            },
            setGuideState: jest.fn(),
        });

        render(MockActiveSymbolsList(default_mock_store));

        act(() => {
            jest.advanceTimersByTime(300);
        });

        const guideContainer = screen.getByTestId('mock-guide-container');
        expect(guideContainer).toHaveAttribute('data-should-run', 'false');
    });
    it('should call setGuideState when guide is closed', async () => {
        const mockSetGuideState = jest.fn();
        (useGuideStates as jest.Mock).mockReturnValue({
            guideStates: {
                should_run_market_selector_guide: true,
            },
            setGuideState: mockSetGuideState,
        });

        render(MockActiveSymbolsList(default_mock_store));

        act(() => {
            jest.advanceTimersByTime(300);
        });

        await userEvent.click(screen.getByTestId('guide-callback-button'));
        expect(mockSetGuideState).toHaveBeenCalledWith('should_run_market_selector_guide', false);
    });
    it('should clean up timer and hide guide on unmount', () => {
        (useGuideStates as jest.Mock).mockReturnValue({
            guideStates: {
                should_run_market_selector_guide: true,
            },
            setGuideState: jest.fn(),
        });

        const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
        const { unmount } = render(MockActiveSymbolsList(default_mock_store));

        unmount();

        expect(clearTimeoutSpy).toHaveBeenCalled();
    });
});
