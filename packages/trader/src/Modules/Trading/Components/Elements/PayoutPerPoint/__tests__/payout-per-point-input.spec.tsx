import React from 'react';
import { render, screen } from '@testing-library/react';
import PayoutPerPointInput from '../payout-per-point-input';
import { useDevice } from '@deriv/components';
import userEvent from '@testing-library/user-event';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    useDevice: jest.fn(() => ({ is_desktop: true })),
    Popover: ({ children }: { children: React.ReactNode }) => (
        <div role='img' aria-label='info'>
            {children}
        </div>
    ),
}));

// eslint-disable-next-line react/display-name
jest.mock('../../../Form/WheelPicker', () => (props: { options: number[]; onClick: (arg0: number) => void }) => (
    <div data-testid='wheel-picker'>
        {props.options.map((option: number, index: number) => (
            <button key={index} onClick={() => props.onClick(option)}>
                {option}
            </button>
        ))}
    </div>
));

const payoutOptions = ['10', '20', '30', '40'];
const mockOnPayoutClick = jest.fn();
const selectedBarrier = '1.2345';
const defaultPayout = '20';
const currency = 'USD';
const tooltipText = 'Sample tooltip text';

const renderComponent = (isDesktop: boolean) => {
    (useDevice as jest.Mock).mockReturnValue({ is_desktop: isDesktop });
    return render(
        <PayoutPerPointInput
            payoutOptions={payoutOptions}
            onPayoutClick={mockOnPayoutClick}
            selectedBarrier={selectedBarrier}
            defaultPayout={defaultPayout}
            contract_type='turboslong'
            currency={currency}
            tooltipText={tooltipText}
        />
    );
};

describe('PayoutPerPointInput Component', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should render component for desktop', () => {
        renderComponent(true);
        expect(screen.getByText('Payout per Point')).toBeInTheDocument();
        expect(screen.getByText('Distance to current spot')).toBeInTheDocument();
        expect(screen.getByText(selectedBarrier)).toBeInTheDocument();
    });

    test('should not render component for mobile', () => {
        renderComponent(false);
        expect(screen.queryByText('Payout per Point')).not.toBeInTheDocument();
        expect(screen.queryByText('Distance to current spot')).not.toBeInTheDocument();
    });

    test('should call onPayoutClick when an option is selected in WheelPicker', async () => {
        renderComponent(true);
        const option = screen.getByText('30');
        await userEvent.click(option);
        expect(mockOnPayoutClick).toHaveBeenCalledWith('30');
    });
});
