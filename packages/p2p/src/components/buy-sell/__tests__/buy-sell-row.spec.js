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

const setSelectedAdvert = jest.fn();
const showAdvertiserPage = jest.fn();

const props = {
    row: {
        advertiser_details: {
            id: '',
            name: 'Test',
        },
        id: '',
    },
};

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
        isMobile.mockReturnValue(true);

        render(<BuySellRow {...props} />);

        const el_dp2p_buy_sell_row__mobile_container = screen.getByTestId('dp2p-buy-sell-row__mobile_container');

        expect(el_dp2p_buy_sell_row__mobile_container).toBeInTheDocument();
    });

    it('Component should be rendered in desktop view', () => {
        useStores.mockImplementation(() => ({
            buy_sell_store: {},
            general_store: {
                client: {
                    currency: 'USD',
                },
            },
        }));
        isMobile.mockReturnValue(false);

        render(<BuySellRow {...props} />);

        const el_dp2p_buy_sel_row__desktop_container = screen.getByRole('row');

        expect(el_dp2p_buy_sel_row__desktop_container).toBeInTheDocument();
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

        render(<BuySellRow {...props} row={{ ...props.row, id: 'WATCH_THIS_SPACE' }} />);

        const el_dp2p_buy_sel_row__slider_animation = screen.getByTestId('dp2p-buy-sell-row__slider_animation_element');

        expect(el_dp2p_buy_sel_row__slider_animation).toBeInTheDocument();
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

        render(<BuySellRow {...props} row={{ ...props.row, id: 'NO_MATCH_ROW' }} />);

        const el__dp2p_buy_sel_row__no_matching_ads = screen.getByText('There are no matching ads.');

        expect(el__dp2p_buy_sel_row__no_matching_ads).toBeInTheDocument();
    });

    it('on mobile view: showAdvertiserPage func should be called on click on advertiser container, setSelectedAdvert func should be called on click on Buy/Sell button', () => {
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
        isMobile.mockReturnValue(true);

        render(<BuySellRow {...props} row={{ ...props.row, account_currency: 'USD' }} />);

        const el_dp2p_buy_sell_row__desktop_advertiser_page__container = screen.getByTestId(
            'dp2p-buy-sell-row__mobile_advertiser_page_container'
        );
        const el_dp2p_buy_sell_row__sell_btn = screen.getByRole('button', { name: 'Sell USD' });

        fireEvent.click(el_dp2p_buy_sell_row__desktop_advertiser_page__container);
        fireEvent.click(el_dp2p_buy_sell_row__sell_btn);

        expect(showAdvertiserPage).toHaveBeenCalledTimes(1);
        expect(setSelectedAdvert).toHaveBeenCalledTimes(1);
    });

    it('on desktop view: showAdvertiserPage func should be called on click on advertiser container, setSelectedAdvert func should be called on click on Buy/Sell button', () => {
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
        isMobile.mockReturnValue(false);

        render(<BuySellRow {...props} row={{ ...props.row, account_currency: 'USD' }} />);

        const el_dp2p_buy_sell_row__desktop_advertiser_page__container = screen.getByTestId(
            'dp2p-buy-sell-row__desktop_advertiser_page_container'
        );
        const el_dp2p_buy_sell_row__sell_btn = screen.getByRole('button', { name: 'Sell USD' });

        fireEvent.click(el_dp2p_buy_sell_row__desktop_advertiser_page__container);
        fireEvent.click(el_dp2p_buy_sell_row__sell_btn);

        expect(showAdvertiserPage).toHaveBeenCalledTimes(1);
        expect(setSelectedAdvert).toHaveBeenCalledTimes(1);
    });
});
