import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import { isMobile } from '@deriv/shared';
import { useStores } from 'Stores';
import { Router } from 'react-router';
import BuySell from '../buy-sell.jsx';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(),
}));

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(),
}));

const mocked_advertiser_page_store = {
    advertiser_details_name: 'test',
    advertiser_info: {},
    advert: {
        account_currency: 'USD',
    },
    adverts: [],
    onTabChange: jest.fn(),
    onMount: jest.fn(),
};

const mocked_buy_sell_store = {
    items: [],
    has_more_items_to_load: true,
    loadMoreItems: jest.fn(),
    registerAdvertIntervalReaction: () => () => {},
    registerIsListedReaction: () => () => {},
    setIsLoading: jest.fn(),
    setItems: jest.fn(),
    setSearchTerm: jest.fn(),
    setShowFilterPaymentMethods: jest.fn(),
    should_use_client_limits: true,
    selected_ad_state: {
        account_currency: 'USD',
    },
    sort_list: [],
};

const mocked_general_store = {
    client: {
        currency: 'USD',
    },
    nickname: 'test',
    poiStatusText: jest.fn(),
    props: {
        modal_root_id: 'test',
    },
};

const mocked_my_profile_store = {
    getAdvertiserPaymentMethods: jest.fn(),
    getPaymentMethodsList: jest.fn(),
    payment_methods_list_items: [],
    setIsCancelAddPaymentMethodModalOpen: jest.fn(),
    setSelectedPaymentMethod: jest.fn(),
    setSelectedPaymentMethodDisplayName: jest.fn(),
    setShouldShowAddPaymentMethodForm: jest.fn(),
    should_show_add_payment_method_form: false,
};

const modal_root_el = document.createElement('div');

describe('<BuySell />', () => {
    beforeAll(() => {
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });
    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('Component should be rendered', () => {
        useStores.mockImplementation(() => ({
            buy_sell_store: mocked_buy_sell_store,
            general_store: mocked_general_store,
            my_profile_store: mocked_my_profile_store,
        }));
        render(<BuySell />);

        const el_dp2p_buy_sell_container = screen.getByTestId('dp2p-buy-sell_container');
        expect(el_dp2p_buy_sell_container).toBeInTheDocument();
    });

    it('onScroll func shoud be called when scroll scrollbars', () => {
        isMobile.mockReturnValueOnce(true);
        useStores.mockImplementation(() => ({
            buy_sell_store: { ...mocked_buy_sell_store, items: [1, 2, 3], rendered_items: [1, 2, 3] },
            general_store: mocked_general_store,
            my_profile_store: mocked_my_profile_store,
        }));
        render(<BuySell />);

        const el_components_scrollbars_container = screen.getByTestId('components-themed-scrollbars_container');
        fireEvent.scroll(el_components_scrollbars_container, { target: { scrollTop: true } });

        expect(screen.queryByTestId('components-animation-wrapper_container')).not.toBeInTheDocument();
    });

    it('<Verification /> component should be rendered if should_show_verification prop is true', () => {
        useStores.mockImplementation(() => ({
            buy_sell_store: { ...mocked_buy_sell_store, should_show_verification: true },
            general_store: mocked_general_store,
            my_profile_store: mocked_my_profile_store,
        }));
        render(<BuySell />);

        const el_dp2p_buy_sell_verification_page_container = screen.getByTestId('dp2p-verification_container');
        expect(el_dp2p_buy_sell_verification_page_container).toBeInTheDocument();
    });

    it('<AdvertiserPage /> component should be rendered if should_show_verification prop is true and show_advertiser_page is false', () => {
        const history = createBrowserHistory();
        useStores.mockImplementation(() => ({
            buy_sell_store: { ...mocked_buy_sell_store, show_advertiser_page: true, should_show_verification: false },
            general_store: mocked_general_store,
            my_profile_store: mocked_my_profile_store,
            advertiser_page_store: mocked_advertiser_page_store,
        }));
        render(
            <Router history={history}>
                <BuySell />
            </Router>
        );

        const el_dp2p_buy_sell_advertiser_page_container = screen.getByTestId('dp2p-advertiser-page_container');
        expect(el_dp2p_buy_sell_advertiser_page_container).toBeInTheDocument();
    });
});
