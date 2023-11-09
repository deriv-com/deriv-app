import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StoreProvider, mockStore } from '@deriv/stores';
import { adverts } from 'Components/my-ads/__mocks__/mock-data';
import MyAdsRowRenderer from '../my-ads-row-renderer';

const mock_store = {
    floating_rate_store: {},
    general_store: {
        is_listed: 0,
    },
    my_profile_store: {
        getAdvertiserPaymentMethods: jest.fn(),
    },
    my_ads_store: {
        selected_ad_id: '1',
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

const mock_modal_manager_context = {
    hideModal: jest.fn(),
    showModal: jest.fn(),
};

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    useModalManagerContext: () => mock_modal_manager_context,
}));

const mock_use_store_values = mockStore({
    client: {
        currency: 'USD',
    },
});

describe('<MyAdsRowRenderer/>', () => {
    it('should display tooltip for hidden ads', () => {
        render(
            <StoreProvider store={mock_use_store_values}>
                <MyAdsRowRenderer row={{ ...adverts, visibility_status: ['advert_inactive'] }} />
            </StoreProvider>
        );
        const icon = screen.getByTestId('dt_popover_wrapper');
        expect(icon).toBeInTheDocument();
        userEvent.hover(icon);
        expect(screen.getByText('Ad not listed')).toBeInTheDocument();
    });
    it('should onClick for hidden ads', () => {
        render(
            <StoreProvider store={mock_use_store_values}>
                <MyAdsRowRenderer row={{ ...adverts, visibility_status: ['advert_inactive'] }} />
            </StoreProvider>
        );
        const visibility_status_icon = screen.getByTestId('dt_visibility_alert_icon');
        userEvent.click(visibility_status_icon);
        expect(mock_modal_manager_context.showModal).toHaveBeenCalledTimes(1);
    });
});
