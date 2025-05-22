import React from 'react';
import { render, screen } from '@testing-library/react';
import PayoutPerPointMobileInput from '../payout-per-point-mobile-input';
import userEvent from '@testing-library/user-event';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Popover: ({ message }: { message: string }) => <div>{message}</div>,
    Icon: ({ icon }: { icon: string }) => <div>{icon}</div>,
}));

jest.mock('../../../Form/WheelPicker/wheel-picker-mobile', () =>
    jest.fn(({ options, currency, onChange }) => (
        <div>
            MockWheelPickerMobile - {currency}
            <button onClick={() => onChange(options[0])}>Set Value</button>
        </div>
    ))
);

describe('PayoutPerPointMobileInput', () => {
    const defaultProps = {
        togglePayoutWheelPicker: jest.fn(),
        payoutChoices: ['10', '20', '30'],
        onPayoutClick: jest.fn(),
        selectedBarrier: '5',
        payout_per_point: '20',
        contract_type: 'turboslong',
        currency: 'USD',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly', () => {
        render(<PayoutPerPointMobileInput {...defaultProps} />);

        expect(screen.getByText('Payout per Point')).toBeInTheDocument();
        expect(screen.getByText('Distance to current spot:')).toBeInTheDocument();
        expect(screen.getByText('MockWheelPickerMobile - USD')).toBeInTheDocument();
        expect(screen.getByText('Save')).toBeInTheDocument();
        expect(screen.getByText('IcCross')).toBeInTheDocument();
    });

    test('WheelPickerMobile component is rendered with correct props', () => {
        render(<PayoutPerPointMobileInput {...defaultProps} />);

        expect(screen.getByText('MockWheelPickerMobile - USD')).toBeInTheDocument();
    });

    test('Popover displays the correct message', () => {
        render(<PayoutPerPointMobileInput {...defaultProps} />);

        expect(
            screen.getAllByText(
                'You will receive a payout at expiry if the spot price never breaches the barrier throughout the contract duration. Otherwise, your contract will be terminated early.'
            ).length
        ).toBeGreaterThan(0);
    });

    test('Save button works correctly', async () => {
        render(<PayoutPerPointMobileInput {...defaultProps} />);

        await userEvent.click(screen.getByText('Set Value'));
        await userEvent.click(screen.getByText('Save'));

        expect(defaultProps.togglePayoutWheelPicker).toHaveBeenCalled();
        expect(defaultProps.onPayoutClick).toHaveBeenCalledWith(defaultProps.payoutChoices[0]);
    });

    test('Close button works correctly', async () => {
        render(<PayoutPerPointMobileInput {...defaultProps} />);

        await userEvent.click(screen.getByText('IcCross'));

        expect(defaultProps.togglePayoutWheelPicker).toHaveBeenCalled();
        expect(defaultProps.onPayoutClick).toHaveBeenCalledWith(defaultProps.payout_per_point);
    });
});
