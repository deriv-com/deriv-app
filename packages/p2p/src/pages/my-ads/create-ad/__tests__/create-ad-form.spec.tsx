import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';
import CreateAdForm from '../create-ad-form';

const mocked_store_values: DeepPartial<ReturnType<typeof useStores>> = {
    floating_rate_store: {
        rate_type: 'float',
        setApiErrorMessage: jest.fn(),
        float_rate_offset_limit: 10.0,
    },
    general_store: {
        advertiser_info: {
            balance_available: 100,
        },
        contact_info: '91012121212',
        default_advert_description: 'test description',
        setP2PConfig: jest.fn(),
    },
    my_ads_store: {
        setPaymentMethodIds: jest.fn(),
        setPaymentMethodNames: jest.fn(),
        current_method: {
            is_deleted: false,
            key: null,
        },
        payment_info: '',
        getWebsiteStatus: jest.fn(),
        handleSubmit: jest.fn(),
        is_ad_created_modal_visible: false,
        restrictDecimalPlace: jest.fn(),
        restrictLength: jest.fn(),
        setApiErrorMessage: jest.fn(),
        setShowAdForm: jest.fn(),
        validateCreateAdForm: jest.fn(),
        setCurrentMethod: jest.fn(),
        api_error_message: '',
    },
    buy_sell_store: {
        create_sell_ad_from_no_ads: false,
        setCreateSellAdFromNoAds: jest.fn(),
    },
    my_profile_store: {
        payment_methods_list: [],
        getPaymentMethodsList: jest.fn(),
        getAdvertiserPaymentMethods: jest.fn(),
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mocked_store_values),
}));

const mock_modal_manager: Partial<ReturnType<typeof useModalManagerContext>> = {
    showModal: jest.fn(),
    useRegisterModalProps: jest.fn(),
};

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

const mock_use_store_values = mockStore({
    client: {
        currency: 'USD',
        local_currency_config: {
            currency: 'USD',
        },
    },
});

describe('<CreateAdForm/>', () => {
    it('should render the create ad form', () => {
        render(
            <StoreProvider store={mock_use_store_values}>
                <CreateAdForm />
            </StoreProvider>
        );
        expect(screen.getByText("You're creating an ad to buy...")).toBeInTheDocument();
    });
    it('should call createAdErrorModal if api throws error message on create ad confirmation', () => {
        (useStores as jest.Mock).mockReturnValueOnce({
            ...mocked_store_values,
            my_ads_store: {
                ...mocked_store_values.my_ads_store,
                api_error_message: 'test error message',
            },
        });
        const { unmount } = render(
            <StoreProvider store={mock_use_store_values}>
                <CreateAdForm />
            </StoreProvider>
        );
        unmount();
        expect(mock_modal_manager.showModal).toBeCalledWith({ key: 'CreateAdErrorModal', props: {} });
    });
    it('should handle switching between buy usd/sell usd radio buttons', () => {
        (useStores as jest.Mock).mockReturnValueOnce({
            ...mocked_store_values,
            my_ads_store: {
                ...mocked_store_values.my_ads_store,
                api_error_message: 'test error message',
            },
        });
        render(
            <StoreProvider store={mock_use_store_values}>
                <CreateAdForm />
            </StoreProvider>
        );
        const sell_usd_radio = screen.getByRole('radio', { name: 'Sell USD' });
        userEvent.click(sell_usd_radio);
    });
    it('should call getWebsiteStatus if ad created modal is visible', () => {
        jest.useFakeTimers();
        (useStores as jest.Mock).mockReturnValue({
            ...mocked_store_values,
            my_ads_store: {
                ...mocked_store_values.my_ads_store,
                is_ad_created_modal_visible: true,
            },
        });
        render(
            <StoreProvider store={mock_use_store_values}>
                <CreateAdForm />
            </StoreProvider>
        );
        jest.advanceTimersByTime(10000);
        expect(mocked_store_values.my_ads_store.getWebsiteStatus).toBeCalled();
        jest.clearAllTimers();
    });
    it('should handle onchange for input fields by calling restrictlength function', () => {
        (useStores as jest.Mock).mockReturnValueOnce({
            ...mocked_store_values,
            floating_rate_store: {
                ...mocked_store_values.floating_rate_store,
                rate_type: 'fixed',
            },
        });

        render(
            <StoreProvider store={mock_use_store_values}>
                <CreateAdForm />
            </StoreProvider>
        );
        const total_amount_input = screen.getByTestId('dt_offer_amount');
        userEvent.type(total_amount_input, '100');
        expect(mocked_store_values.my_ads_store.restrictLength).toHaveBeenCalled();
    });
    it('should handle onchange for floating rate field to restrict decimal places', () => {
        render(
            <StoreProvider store={mock_use_store_values}>
                <CreateAdForm />
            </StoreProvider>
        );
        const total_amount_input = screen.getByTestId('dt_float_rate_type');
        userEvent.type(total_amount_input, '100');
        expect(mocked_store_values.my_ads_store.restrictDecimalPlace).toHaveBeenCalled();
    });
    it('should show balance hint for sell ads', () => {
        (useStores as jest.Mock).mockReturnValueOnce({
            ...mocked_store_values,
            buy_sell_store: {
                ...mocked_store_values.buy_sell_store,
                create_sell_ad_from_no_ads: true,
            },
        });
        render(
            <StoreProvider store={mock_use_store_values}>
                <CreateAdForm />
            </StoreProvider>
        );

        expect(screen.getByText('Your Deriv P2P balance is 100.00 USD')).toBeInTheDocument();
    });
});
