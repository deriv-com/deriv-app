import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { isMobile } from '@deriv/shared';
import CryptoDeposit from '../crypto-deposit';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('@deriv/shared/src/utils/screen/responsive', () => ({
    ...jest.requireActual('@deriv/shared/src/utils/screen/responsive'),
    isMobile: jest.fn(),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    ButtonLink: () => <div>ButtonLink</div>,
    Loading: () => <div>Loading</div>,
    Dropdown: () => <div>Dropdown</div>,
}));
jest.mock('Components/recent-transaction', () => () => <div>RecentTransaction</div>);
jest.mock('qrcode.react', () => () => <div>QRCode</div>);

describe('CryptoDeposit', () => {
    const mockProps = () => ({
        currency: 'ETH',
        deposit_address: '',
        recentTransactionOnMount: jest.fn(),
        pollApiForDepositAddress: jest.fn(),
        setIsDeposit: jest.fn(),
    });

    it('Should show loading if "is_deposit_address_loading" is true', () => {
        const props = mockProps();
        render(<CryptoDeposit {...props} is_deposit_address_loading />);

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('Should show API error section and trigger the button click if the API returns any error', () => {
        const props = mockProps();
        props.api_error = 'error';
        props.crypto_transactions = [];

        const wrapper = render(<CryptoDeposit {...props} />);
        const div = wrapper.container.querySelector('.crypto-api-error');
        const btn = wrapper.getByRole('button', { name: 'Refresh' });
        fireEvent.click(btn);

        expect(div).toBeInTheDocument();
        expect(btn).toBeInTheDocument();
        expect(props.pollApiForDepositAddress).toHaveBeenCalled();
    });

    it('Should show QR code section if the active currency is BTC', () => {
        const props = mockProps();
        props.currency = 'BTC';
        props.api_error = null;
        props.deposit_address = 'bc1qcldul6wh9m659qanr9nyshzfaltn80ndddrysw';

        const { container } = render(<CryptoDeposit {...props} />);
        const clipboard_div = container.querySelector('.crypto-deposit__clipboard');

        expect(clipboard_div).toBeInTheDocument();
        expect(screen.getByText('QRCode')).toBeInTheDocument();
        expect(screen.queryByText('Dropdown')).not.toBeInTheDocument();
    });

    it('Should show QR code section if the active currency is BTC in Mobile', () => {
        isMobile.mockReturnValue(true);
        const props = mockProps();
        props.currency = 'BTC';
        props.api_error = null;
        props.deposit_address = 'bc1qcldul6wh9m659qanr9nyshzfaltn80ndddrysw';

        const { container } = render(<CryptoDeposit {...props} />);
        const clipboard_div = container.querySelector('.crypto-deposit__clipboard');

        expect(clipboard_div).toBeInTheDocument();
        expect(screen.getByText('QRCode')).toBeInTheDocument();
        expect(screen.queryByText('Dropdown')).not.toBeInTheDocument();
    });

    it('Should show the "Try our Fiat onramp" button', () => {
        const props = mockProps();

        render(<CryptoDeposit {...props} />);

        expect(screen.getByText('Looking for a way to buy cryptocurrency?')).toBeInTheDocument();
        expect(screen.getByText('ButtonLink')).toBeInTheDocument();
    });

    it('Should show the "RecentTransaction" component in mobile and if any transaction exist', () => {
        isMobile.mockReturnValue(true);
        const props = mockProps();
        props.crypto_transactions = ['test'];

        render(<CryptoDeposit {...props} />);

        expect(screen.getByText('RecentTransaction')).toBeInTheDocument();
    });

    it('Should show dropdown list if the curreny is ETH', () => {
        const props = mockProps();
        props.api_error = null;

        render(<CryptoDeposit {...props} />);

        expect(props.pollApiForDepositAddress).toHaveBeenCalledWith(false);
        expect(props.recentTransactionOnMount).toHaveBeenCalled();
        expect(props.setIsDeposit).toHaveBeenCalledWith(true);
        expect(screen.getByText('Dropdown')).toBeInTheDocument();
    });
});
