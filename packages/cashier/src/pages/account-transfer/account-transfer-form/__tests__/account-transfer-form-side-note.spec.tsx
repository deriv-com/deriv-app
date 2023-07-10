import React from 'react';
import { screen, render } from '@testing-library/react';
import AccountTransferNote from '../account-transfer-form-side-note';

let mock_props: React.ComponentProps<typeof AccountTransferNote>;

describe('<AccountTransferNote />', () => {
    beforeEach(() => {
        mock_props = {
            allowed_transfers_count: {
                internal: 10,
                mt5: 10,
                dxtrade: 10,
                derivez: 10,
            },
            currency: 'USD',
            is_dxtrade_allowed: false,
            minimum_fee: '10',
            is_crypto_to_crypto_transfer: false,
            is_derivez_transfer: false,
            is_dxtrade_transfer: false,
        };
    });
    it('should show the correct side notes if deriv x is not allowed', () => {
        render(<AccountTransferNote {...mock_props} />);
        expect(
            screen.getByText(
                'You may transfer between your Deriv fiat, cryptocurrency, Deriv MT5, and Deriv EZ accounts.'
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                'Each day, you can make up to 10 transfers between your Deriv accounts, up to 10 transfers between your Deriv and Deriv MT5 accounts, and up to 10 transfers between your Deriv and Deriv EZ accounts.'
            )
        ).toBeInTheDocument();
        expect(screen.getByText('Transfer limits may vary depending on the exchange rates.')).toBeInTheDocument();
        expect(screen.getByText('Please bear in mind that some transfers may not be possible.')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Transfers may be unavailable due to high volatility or technical issues and when the exchange markets are closed.'
            )
        ).toBeInTheDocument();
    });
    it('should show the correct side notes if deriv x is allowed', () => {
        mock_props.is_dxtrade_allowed = true;
        render(<AccountTransferNote {...mock_props} />);
        expect(
            screen.getByText(
                'You may transfer between your Deriv fiat, cryptocurrency, Deriv MT5, Deriv EZ and Deriv X accounts.'
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                'Each day, you can make up to 10 transfers between your Deriv accounts, up to 10 transfers between your Deriv and Deriv MT5 accounts, up to 10 transfers between your Deriv and Deriv EZ accounts, and up to 10 transfers between your Deriv and Deriv X accounts.'
            )
        ).toBeInTheDocument();
    });
    it('should show transfer fee note for transfer_fee = 0', () => {
        mock_props.transfer_fee = 0;
        render(<AccountTransferNote {...mock_props} />);
        expect(
            screen.getByText(
                'We do not charge a transfer fee for transfers in the same currency between your Deriv fiat and Deriv MT5 accounts and your Deriv fiat and Deriv EZ accounts. Please bear in mind that some transfers may not be possible.'
            )
        ).toBeInTheDocument();
    });
    it('should show transfer fee note for transfer_fee = 0 and dxtrade is allowed', () => {
        mock_props.transfer_fee = 0;
        mock_props.is_dxtrade_allowed = true;
        render(<AccountTransferNote {...mock_props} />);
        expect(
            screen.getByText(
                'We do not charge a transfer fee for transfers in the same currency between your Deriv fiat and Deriv MT5 accounts, your Deriv fiat and Deriv EZ accounts and your Deriv fiat and Deriv X accounts. Please bear in mind that some transfers may not be possible.'
            )
        ).toBeInTheDocument();
    });
    it('should show transfer fee note for transfer_fee = 1', () => {
        mock_props.transfer_fee = 1;
        render(<AccountTransferNote {...mock_props} />);
        expect(
            screen.getByText(
                'We’ll charge a 1% transfer fee for transfers in different currencies between your Deriv fiat and Deriv MT5 accounts and your Deriv fiat and Deriv EZ accounts. Please bear in mind that some transfers may not be possible.'
            )
        ).toBeInTheDocument();
    });
    it('should show transfer fee note for transfer_fee = 1 and dxtrade is allowed', () => {
        mock_props.transfer_fee = 1;
        mock_props.is_dxtrade_allowed = true;
        render(<AccountTransferNote {...mock_props} />);
        expect(
            screen.getByText(
                'We’ll charge a 1% transfer fee for transfers in different currencies between your Deriv fiat and Deriv MT5 accounts, your Deriv fiat and Deriv EZ accounts, and your Deriv fiat and Deriv X accounts. Please bear in mind that some transfers may not be possible.'
            )
        ).toBeInTheDocument();
    });
    it('should show transfer fee note for transfer_fee = 2', () => {
        mock_props.transfer_fee = 2;
        render(<AccountTransferNote {...mock_props} />);
        expect(
            screen.getByText(
                'We’ll charge a 2% transfer fee or 10 USD, whichever is higher, for transfers between your Deriv fiat and Deriv cryptocurrency accounts. Please bear in mind that some transfers may not be possible.'
            )
        ).toBeInTheDocument();
    });
    it('should show transfer fee note for transfer_fee = 2 and crypto to crypto transfer', () => {
        mock_props.transfer_fee = 2;
        mock_props.is_crypto_to_crypto_transfer = true;
        render(<AccountTransferNote {...mock_props} />);
        expect(
            screen.getByText(
                'We’ll charge a 2% transfer fee or 10 USD, whichever is higher, for transfers between your Deriv cryptocurrency accounts. Please bear in mind that some transfers may not be possible.'
            )
        ).toBeInTheDocument();
    });
    it('should show transfer fee note for transfer_fee = 2 and derivez transfer', () => {
        mock_props.transfer_fee = 2;
        mock_props.is_derivez_transfer = true;
        render(<AccountTransferNote {...mock_props} />);
        expect(
            screen.getByText(
                'We’ll charge a 2% transfer fee or 10 USD, whichever is higher, for transfers between your Deriv cryptocurrency and Deriv MT5 accounts and your Deriv cryptocurrency and Deriv EZ accounts. Please bear in mind that some transfers may not be possible.'
            )
        ).toBeInTheDocument();
    });
    it('should show transfer fee note for transfer_fee = 2 and dxtrade transfer is allowed', () => {
        mock_props.transfer_fee = 2;
        mock_props.is_dxtrade_allowed = true;
        mock_props.is_dxtrade_transfer = true;
        render(<AccountTransferNote {...mock_props} />);
        expect(
            screen.getByText(
                'We’ll charge a 2% transfer fee or 10 USD, whichever is higher, for transfers between your Deriv cryptocurrency and Deriv MT5 accounts, your Deriv cryptocurrency and Deriv EZ accounts, and your Deriv cryptocurrency and Deriv X accounts. Please bear in mind that some transfers may not be possible.'
            )
        ).toBeInTheDocument();
    });
});
