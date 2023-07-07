import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { isMobile } from '@deriv/shared';
import { mockStore, StoreProvider } from '@deriv/stores';
import { useStores } from 'Stores/index';
import MyAdsRow from '../my-ads-row';
import { adverts } from '../../__mocks__/mock-data';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    floating_rate_store: {
        change_ad_alert: false,
        rate_type: 'float',
        reached_target_date: false,
        exchange_rate: 1,
    },
    my_ads_store: {
        delete_error_message: '',
        onClickActivateDeactivate: jest.fn(),
        showQuickAddModal: jest.fn(),
        onClickEdit: jest.fn(),
        onClickDelete: jest.fn(),
        onToggleSwitchModal: jest.fn(),
    },
    general_store: {
        is_listed: 1,
        is_barred: 0,
        showModal: jest.fn(),
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
    isDesktop: jest.fn(() => true),
}));

const mock = mockStore({
    client: {
        currency: 'USD',
    },
});

const props = {
    row: {
        ...adverts[0],
    },
};

describe('<MyAdsRow/>', () => {
    it('should render the MyAdsRow component', () => {
        render(
            <StoreProvider store={mock}>
                <MyAdsRow {...props} />
            </StoreProvider>
        );

        expect(screen.getByText('Buy 138')).toBeInTheDocument();
        expect(screen.getByText('Bank Transfer')).toBeInTheDocument();
        expect(screen.getByText('Active')).toBeInTheDocument();
    });
    it('should handle onclick for add payment method', () => {
        const new_props = { ...props, row: { ...props.row, payment_method_names: null } };
        render(
            <StoreProvider store={mock}>
                <MyAdsRow {...new_props} />
            </StoreProvider>
        );

        expect(screen.getByText('Buy 138')).toBeInTheDocument();
        const add_button = screen.getByText('Add');
        userEvent.click(add_button);
        expect(mock_store.my_ads_store.showQuickAddModal).toBeCalledTimes(1);
    });
    it('should render the component in mobile view', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        const new_props = { ...props, row: { ...props.row, payment_method_names: null } };
        render(
            <StoreProvider store={mock}>
                <MyAdsRow {...new_props} />
            </StoreProvider>
        );

        expect(screen.getByText('Buy 138')).toBeInTheDocument();
    });
    it('should handle clicking on activate/deactivate ads', () => {
        (isMobile as jest.Mock).mockReturnValue(false);
        render(
            <StoreProvider store={mock}>
                <MyAdsRow {...props} />
            </StoreProvider>
        );

        const row = screen.getByText('Buy 138');
        userEvent.hover(row);
        const activate_button = screen.getByTestId('dt_activate_deactivate_ad');
        userEvent.click(activate_button);
        expect(mock_store.my_ads_store.onClickActivateDeactivate).toBeCalledTimes(1);
    });
    it('should handle clicking on edit ad', () => {
        render(
            <StoreProvider store={mock}>
                <MyAdsRow {...props} />
            </StoreProvider>
        );

        const row = screen.getByText('Buy 138');
        userEvent.hover(row);
        const edit_button = screen.getByTestId('dt_edit_ad');
        userEvent.click(edit_button);
        expect(mock_store.my_ads_store.onClickEdit).toBeCalledTimes(1);
    });
    it('should handle clicking on delete ad', () => {
        render(
            <StoreProvider store={mock}>
                <MyAdsRow {...props} />
            </StoreProvider>
        );

        const row = screen.getByText('Buy 138');
        userEvent.hover(row);
        const delete_button = screen.getByTestId('dt_delete_ad');
        userEvent.click(delete_button);
        expect(mock_store.my_ads_store.onClickDelete).toBeCalledTimes(1);
    });
    it('should show MyAdsFloatingRateSwitchModal onclicking edit when rate type has changed', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mock_store,
            floating_rate_store: {
                ...mock_store.floating_rate_store,
                change_ad_alert: true,
            },
        });
        render(
            <StoreProvider store={mock}>
                <MyAdsRow {...props} />
            </StoreProvider>
        );

        const row = screen.getByText('Buy 138');
        userEvent.hover(row);
        const edit_button = screen.getByTestId('dt_edit_ad');
        userEvent.click(edit_button);
        expect(mock_store.my_ads_store.onToggleSwitchModal).toBeCalledTimes(1);
        expect(mock_store.general_store.showModal).toHaveBeenLastCalledWith({
            key: 'MyAdsFloatingRateSwitchModal',
        });
        userEvent.unhover(row);
    });
});
