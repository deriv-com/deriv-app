import React from 'react';
import { act } from 'react-dom/test-utils';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CryptoWithdrawForm from '../crypto-withdraw-form.jsx';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<CryptoWithdrawForm />', () => {
    const mockProps = () => ({
        account_platform_icon: 'icon',
        blockchain_address: 'tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt',
        currency: 'BTC',
        onChangeConverterFromAmount: jest.fn(),
        onChangeConverterToAmount: jest.fn(),
        onMountWithdraw: jest.fn(),
        percentageSelectorSelectionStatus: jest.fn(),
        recentTransactionOnMount: jest.fn(),
        resetConverter: jest.fn(),
        requestWithdraw: jest.fn(),
        setBlockchainAddress: jest.fn(),
        setWithdrawPercentageSelectorResult: jest.fn(),
    });

    it('component and header should be rendered', () => {
        const props = mockProps();
        const { container } = render(<CryptoWithdrawForm {...props} />);

        expect(screen.getByText('Your BTC wallet address')).toBeInTheDocument();
        expect(container.querySelector('.cashier__wrapper')).toBeInTheDocument();
        expect(container.querySelector('.cashier__content-header')).toBeInTheDocument();
    });

    it('should show a proper error if address is not provided', async () => {
        const props = mockProps();
        const { container } = render(<CryptoWithdrawForm {...props} />);

        const address_field = container.querySelector('input[name=address]');

        act(() => {
            fireEvent.change(address_field, { target: { value: '1' } });
        });
        act(() => {
            fireEvent.change(address_field, { target: { value: '' } });
        });
        await waitFor(() => {
            expect(screen.getByText('This field is required.')).toBeInTheDocument();
        });
    });

    it('should show a proper error if provided address has less characters than needed', async () => {
        const props = mockProps();
        const { container } = render(<CryptoWithdrawForm {...props} />);

        const address_field = container.querySelector('input[name=address]');

        act(() => {
            fireEvent.change(address_field, { target: { value: 'address less than 25' } });
        });
        await waitFor(() => {
            expect(screen.getByText('Your wallet address should have 25 to 64 characters.')).toBeInTheDocument();
        });
    });

    it('should show a proper error if provided address has more characters than needed', async () => {
        const props = mockProps();
        const { container } = render(<CryptoWithdrawForm {...props} />);

        const address_field = container.querySelector('input[name=address]');

        act(() => {
            fireEvent.change(address_field, {
                target: { value: 'address more than 64 characters created to not pass validation conditions!' },
            });
        });
        await waitFor(() => {
            expect(screen.getByText('Your wallet address should have 25 to 64 characters.')).toBeInTheDocument();
        });
    });

    it("requestWithdraw func should be called if value provided from 'converter_from_amount' input and withdraw button is clicked", async () => {
        const props = mockProps();
        const { container } = render(<CryptoWithdrawForm {...props} />);

        const address_field = container.querySelector('input[name=address]');
        const converter_from_amount_field = container.querySelector('input[name=converter_from_amount]');
        const withdraw_button = screen.getByText('Withdraw');

        act(() => {
            fireEvent.change(address_field, { target: { value: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2' } });
        });
        act(() => {
            fireEvent.change(converter_from_amount_field, { target: { value: '0.0006' } });
        });
        act(() => {
            fireEvent.click(withdraw_button);
        });

        await waitFor(() => expect(props.requestWithdraw).toHaveBeenCalled());
    });

    it("requestWithdraw func should be called if value provided from 'converter_to_amount' input and withdraw button is clicked", async () => {
        const props = mockProps();
        const { container } = render(<CryptoWithdrawForm {...props} />);

        const address_field = container.querySelector('input[name=address]');
        const converter_to_amount_field = container.querySelector('input[name=converter_to_amount]');
        const withdraw_button = screen.getByText('Withdraw');

        act(() => {
            fireEvent.change(address_field, { target: { value: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2' } });
        });
        act(() => {
            fireEvent.change(converter_to_amount_field, { target: { value: '200' } });
        });
        act(() => {
            fireEvent.click(withdraw_button);
        });
        await waitFor(() => expect(props.requestWithdraw).toHaveBeenCalled());
    });
});
