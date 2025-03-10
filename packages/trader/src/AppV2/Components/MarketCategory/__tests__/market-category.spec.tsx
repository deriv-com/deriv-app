import React from 'react';
import { screen, render } from '@testing-library/react';
import MarketCategory from '../market-category';
import { ActiveSymbols } from '@deriv/api-types';
import { mockStore } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
import TraderProviders from '../../../../trader-providers';
import useGuideStates from 'AppV2/Hooks/useGuideStates';

jest.mock('AppV2/Components/MarketCategoryItem', () =>
    jest.fn(props => <div ref={props.ref}>MockedMarketCategoryItem</div>)
);

jest.mock('AppV2/Components/FavoriteSymbols', () => jest.fn(() => <div>MockedFavoriteSymbols</div>));

jest.mock('AppV2/Hooks/useGuideStates', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        guideStates: {
            should_run_market_selector_guide: false,
        },
    })),
}));

const mockedMarketCategory = (mocked_store: TCoreStores, mock_props: React.ComponentProps<typeof MarketCategory>) => {
    return (
        <TraderProviders store={mocked_store}>
            <MarketCategory {...mock_props} />
        </TraderProviders>
    );
};
describe('<MarketCategory />', () => {
    const default_mock_store = {
        client: {
            is_logged_in: false,
        },
    };

    const mocked_props = {
        category: {
            market: 'forex',
            market_display_name: 'Forex',
            subgroups: {
                none: {
                    subgroup_display_name: 'Forex',
                    submarkets: {
                        major_pairs: {
                            submarket_display_name: 'Major Pairs',
                            items: [
                                {
                                    symbol: 'frxAUDUSD',
                                    display_name: 'AUD/USD',
                                    market: 'forex',
                                    market_display_name: 'Forex',
                                    subgroup: 'none',
                                    subgroup_display_name: 'None',
                                    submarket: 'major_pairs',
                                    submarket_display_name: 'Major Pairs',
                                },
                                {
                                    symbol: 'frxUSDCAD',
                                    display_name: 'USD/CAD',
                                    market: 'forex',
                                    market_display_name: 'Forex',
                                    subgroup: 'none',
                                    subgroup_display_name: 'None',
                                    submarket: 'major_pairs',
                                    submarket_display_name: 'Major Pairs',
                                },
                            ] as ActiveSymbols,
                        },
                    },
                },
            },
        },
        selectedSymbol: '',
        setSelectedSymbol: jest.fn,
        setIsOpen: jest.fn(),
        isOpen: false,
    };

    it('should render correct labels', () => {
        render(mockedMarketCategory(mockStore(default_mock_store), mocked_props));
        expect(screen.getByText('Major Pairs')).toBeInTheDocument();
        expect(screen.getAllByText('MockedMarketCategoryItem')).toHaveLength(2);
    });
    it('should render FavoriteSymbols component when market is favorites', () => {
        const favoriteProps = {
            ...mocked_props,
            category: {
                market: 'favorites',
                market_display_name: 'Favourites',
                subgroups: {},
            },
        };
        render(mockedMarketCategory(mockStore(default_mock_store), favoriteProps));
        expect(screen.getByText('MockedFavoriteSymbols')).toBeInTheDocument();
    });
    it('should not render joyride-element when user is not logged in', () => {
        (useGuideStates as jest.Mock).mockReturnValue({
            guideStates: {
                should_run_market_selector_guide: true,
            },
        });

        render(mockedMarketCategory(mockStore({ client: { is_logged_in: false } }), mocked_props));
        expect(screen.queryByTestId('joyride-element')).not.toBeInTheDocument();
    });
    it('should not render joyride-element when should_run_market_selector_guide is false', () => {
        (useGuideStates as jest.Mock).mockReturnValue({
            guideStates: {
                should_run_market_selector_guide: false,
            },
        });

        render(mockedMarketCategory(mockStore({ client: { is_logged_in: true } }), mocked_props));
        expect(screen.queryByTestId('joyride-element')).not.toBeInTheDocument();
    });
    it('should render joyride-element when user is logged in and should_run_market_selector_guide is true', () => {
        (useGuideStates as jest.Mock).mockReturnValue({
            guideStates: {
                should_run_market_selector_guide: true,
            },
        });

        render(mockedMarketCategory(mockStore({ client: { is_logged_in: true } }), mocked_props));
        expect(screen.getByTestId('joyride-element')).toBeInTheDocument();
    });
});
