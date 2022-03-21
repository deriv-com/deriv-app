import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useStores } from 'Stores';
import BuySellForm from '../buy-sell-form.jsx';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(),
}));

const mocked_advertiser_page_store = {
    setFormErrorMessage: jest.fn(),
};

const mocked_buy_sell_store = {
    advert: {
        advertiser_details: {
            name: 'test',
        },
        description: 'test',
        payment_method_names: ['BankTransfer', 'Other'],
    },
    contact_info: 'test',
    form_props: {
        setIsSubmitDisabled: jest.fn(() => [false, () => {}]),
        setSubmitForm: jest.fn(),
    },
    is_sell_advert: true,
    payment_method_ids: [],
    setFormProps: jest.fn(),
    setHasPaymentMethods: jest.fn(),
    setInitialReceiveAmount: jest.fn(),
    setReceiveAmount: jest.fn(),
};

const mocked_my_profile_store = {
    advertiser_payment_methods_list: [{ display_name: 'BankTransfer', ID: '123' }],
    getPaymentMethodsList: jest.fn(),
    setSelectedPaymentMethod: jest.fn(),
    setSelectedPaymentMethodDisplayName: jest.fn(),
    setShouldShowAddPaymentMethodForm: jest.fn(),
};

describe('<BuySellModal />', () => {
    it('Proper component should be rendered on desktop view', () => {
        useStores.mockImplementation(() => ({
            advertiser_page_store: mocked_advertiser_page_store,
            buy_sell_store: mocked_buy_sell_store,
            my_profile_store: mocked_my_profile_store,
        }));
        render(<BuySellForm />);

        expect(screen.getByTestId('dp2p-buy-sell-form_container')).toBeInTheDocument();
    });

    it('Amount input must handle a non empty value', () => {
        useStores.mockImplementation(() => ({
            advertiser_page_store: mocked_advertiser_page_store,
            buy_sell_store: {
                ...mocked_buy_sell_store,
                advert: { ...mocked_buy_sell_store.advert, payment_method_names: ['BankTransfer'] },
            },
            my_profile_store: mocked_my_profile_store,
        }));
        render(<BuySellForm />);

        const el_dp2p_buy_sell_form_amount_input = screen.getByRole('spinbutton');
        fireEvent.change(el_dp2p_buy_sell_form_amount_input, { target: { value: '123' } });
        expect(mocked_buy_sell_store.setReceiveAmount).toHaveBeenCalled();
    });

    it('Amount input must handle an empty value', () => {
        useStores.mockImplementation(() => ({
            advertiser_page_store: mocked_advertiser_page_store,
            buy_sell_store: {
                ...mocked_buy_sell_store,
                advert: { ...mocked_buy_sell_store.advert, payment_method_names: ['BankTransfer'] },
            },
            my_profile_store: mocked_my_profile_store,
        }));
        render(<BuySellForm />);

        const el_dp2p_buy_sell_form_amount_input = screen.getByRole('spinbutton');
        fireEvent.change(el_dp2p_buy_sell_form_amount_input, { target: { value: '123' } });
        fireEvent.change(el_dp2p_buy_sell_form_amount_input, { target: { value: '' } });

        expect(mocked_buy_sell_store.setReceiveAmount).toHaveBeenCalledWith(0);
    });

    it('Should be able to add a listed payment method', async () => {
        useStores.mockImplementation(() => ({
            advertiser_page_store: mocked_advertiser_page_store,
            buy_sell_store: {
                ...mocked_buy_sell_store,
                advert: { ...mocked_buy_sell_store.advert, payment_method_names: ['BankTransfer'] },
            },
            my_profile_store: mocked_my_profile_store,
        }));
        render(<BuySellForm />);

        const el_dp2p_buy_sell_form_listed_payment_method_name = screen.getByTestId(
            'dp2p-buy-sell-form_listed-payment-method-name'
        );
        fireEvent.click(el_dp2p_buy_sell_form_listed_payment_method_name);
        await waitFor(() => {
            expect(mocked_buy_sell_store.payment_method_ids).toContain('123');
        });
    });

    it('Should be able to add an unlisted payment method', () => {
        useStores.mockImplementation(() => ({
            advertiser_page_store: mocked_advertiser_page_store,
            buy_sell_store: {
                ...mocked_buy_sell_store,
                advert: { ...mocked_buy_sell_store.advert, payment_method_names: ['test_name'] },
            },
            my_profile_store: mocked_my_profile_store,
        }));
        render(<BuySellForm />);

        const el_dp2p_buy_sell_form_listed_payment_method_name = screen.getByTestId(
            'dp2p-buy-sell-form_unlisted-payment-method-name'
        );
        fireEvent.click(el_dp2p_buy_sell_form_listed_payment_method_name);
        expect(mocked_my_profile_store.setSelectedPaymentMethodDisplayName).toHaveBeenCalledWith('test_name');
        expect(mocked_my_profile_store.setShouldShowAddPaymentMethodForm).toHaveBeenCalledWith(true);
    });

    it('Should not able to add same payment method more than once', async () => {
        useStores.mockImplementation(() => ({
            advertiser_page_store: mocked_advertiser_page_store,
            buy_sell_store: {
                ...mocked_buy_sell_store,
                advert: { ...mocked_buy_sell_store.advert, payment_method_names: ['BankTransfer'] },
                payment_method_ids: ['123'],
            },
            my_profile_store: mocked_my_profile_store,
        }));
        render(<BuySellForm />);

        const el_dp2p_buy_sell_form_listed_payment_method_name = screen.getByTestId(
            'dp2p-buy-sell-form_listed-payment-method-name'
        );
        fireEvent.click(el_dp2p_buy_sell_form_listed_payment_method_name);

        await waitFor(() => {
            expect(mocked_buy_sell_store.payment_method_ids).toContain('123');
        });
    });
});
