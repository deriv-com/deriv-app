import React from 'react';
import { fireEvent, screen, render } from '@testing-library/react';
import { isMobile } from '@deriv/shared';
import { useStores } from 'Stores';
import BuySellRow from '../buy-sell-row.jsx';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(),
}));

jest.mock('@deriv/shared/src/utils/screen/responsive', () => ({
    ...jest.requireActual('@deriv/shared/src/utils/screen/responsive'),
    isMobile: jest.fn(),
}));

const mockProps = () => ({
    row: {
        advertiser_details: {
            id: '',
            name: 'Test',
        },
        id: '',
    },
});

describe('<BuySellRow />', () => {
    it('Component should be rendered in mobile view', () => {
        useStores.mockImplementation(() => ({
            buy_sell_store: {},
            general_store: {
                client: {
                    currency: 'USD',
                },
            },
        }));
        const props = mockProps();
        isMobile.mockReturnValue(true);

        render(<BuySellRow {...props} />);

        expect(screen.getByTestId('mobileContainer')).toBeInTheDocument();
    });

    it('Component should be rendered in desktop view', () => {
        isMobile.mockReturnValue(false);
        useStores.mockImplementation(() => ({
            buy_sell_store: {},
            general_store: {
                client: {
                    currency: 'USD',
                },
            },
        }));
        const props = mockProps();

        render(<BuySellRow {...props} />);

        expect(screen.getByTestId('desktopContainer')).toBeInTheDocument();
    });

    it('Component should show slider animation effect', () => {
        useStores.mockImplementation(() => ({
            buy_sell_store: {},
            general_store: {
                client: {
                    currency: 'USD',
                },
            },
        }));
        const props = mockProps();
        props.row.id = 'WATCH_THIS_SPACE';

        render(<BuySellRow {...props} />);

        expect(screen.getByTestId('sliderAnimationElement')).toBeInTheDocument();
    });

    it("Component should show proper 'no matching ads' text message", () => {
        useStores.mockImplementation(() => ({
            buy_sell_store: {},
            general_store: {
                client: {
                    currency: 'USD',
                },
            },
        }));
        const props = mockProps();
        props.row.id = 'NO_MATCH_ROW';

        render(<BuySellRow {...props} />);

        expect(screen.getByText('There are no matching ads.')).toBeInTheDocument();
    });

    it('on mobile view: showAdvertiserPage func should be called on click on advertiser container, setSelectedAdvert func should be called on click on Buy/Sell button', () => {
        const showAdvertiserPage = jest.fn();
        const setSelectedAdvert = jest.fn();

        useStores.mockImplementation(() => ({
            buy_sell_store: {
                showAdvertiserPage,
                setSelectedAdvert,
            },
            general_store: {
                client: {
                    currency: 'USD',
                },
                isBarred: false,
            },
        }));
        const props = mockProps();
        props.row.account_currency = 'USD';
        isMobile.mockReturnValue(true);

        render(<BuySellRow {...props} />);

        const advertiserContainer = screen.getByTestId('mobileAdvertisersPageContainer');
        const btn = screen.getByRole('button', { name: 'Sell USD' });
        fireEvent.click(advertiserContainer);
        fireEvent.click(btn);

        expect(showAdvertiserPage).toHaveBeenCalledTimes(1);
        expect(setSelectedAdvert).toHaveBeenCalledTimes(1);
    });

    it('on desktop view: showAdvertiserPage func should be called on click on advertiser container, setSelectedAdvert func should be called on click on Buy/Sell button', () => {
        const showAdvertiserPage = jest.fn();
        const setSelectedAdvert = jest.fn();

        useStores.mockImplementation(() => ({
            buy_sell_store: {
                showAdvertiserPage,
                setSelectedAdvert,
            },
            general_store: {
                client: {
                    currency: 'USD',
                },
                isBarred: false,
            },
        }));
        const props = mockProps();
        props.row.account_currency = 'USD';
        isMobile.mockReturnValue(false);

        render(<BuySellRow {...props} />);

        const advertiserContainer = screen.getByTestId('desktopContainer');
        const btn = screen.getByRole('button', { name: 'Sell USD' });
        fireEvent.click(advertiserContainer);
        fireEvent.click(btn);

        expect(showAdvertiserPage).toHaveBeenCalledTimes(1);
        expect(setSelectedAdvert).toHaveBeenCalledTimes(1);
    });
});
