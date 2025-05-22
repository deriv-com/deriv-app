import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PayoutSelector from '../payout-selector';
import { useTraderStore } from 'Stores/useTraderStores';
import { useDevice } from '@deriv-com/ui';

jest.mock('Stores/useTraderStores');

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(),
}));

jest.mock('Modules/Trading/Components/Elements/PayoutPerPoint/payout-per-point-input', () => {
    const MockPayoutPerPointInput = ({ onPayoutClick }: { onPayoutClick: (option: number) => void }) => (
        <div data-testid='payout-per-point-input'>
            <button onClick={() => onPayoutClick(30)}>Click me</button>
        </div>
    );
    MockPayoutPerPointInput.displayName = 'MockPayoutPerPointInput';
    return MockPayoutPerPointInput;
});

const mockUseTraderStore = useTraderStore as jest.Mock;
const mockUseDevice = useDevice as jest.Mock;

const mockTraderStore = {
    barrier_1: '1.2345',
    payout_choices: [10, 20, 30, 40],
    setPayoutPerPoint: jest.fn(),
    togglePayoutWheelPicker: jest.fn(),
    payout_per_point: 20,
    currency: 'USD',
};

describe('PayoutSelector Component', () => {
    beforeEach(() => {
        mockUseTraderStore.mockReturnValue(mockTraderStore);
        mockUseDevice.mockReturnValue({ isMobile: false });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should render PayoutPerPointInput when isMobile is false', () => {
        render(<PayoutSelector />);
        expect(screen.getByTestId('payout-per-point-input')).toBeInTheDocument();
    });

    test('should render mobile widget when isMobile is true', () => {
        mockUseDevice.mockReturnValue({ isMobile: true });
        render(<PayoutSelector />);
        expect(screen.getByText('20 USD')).toBeInTheDocument();
        expect(screen.getByText('1.2345')).toBeInTheDocument();
        expect(screen.getByText('Payout per point')).toBeInTheDocument();
    });

    test('should call setPayoutPerPoint when an option is clicked in PayoutPerPointInput', () => {
        render(<PayoutSelector />);
        fireEvent.click(screen.getByText('Click me'));
        expect(mockTraderStore.setPayoutPerPoint).toHaveBeenCalledWith(30);
    });

    test('should call togglePayoutWheelPicker when mobile widget is clicked', () => {
        mockUseDevice.mockReturnValue({ isMobile: true });
        render(<PayoutSelector />);
        fireEvent.click(screen.getByText('20 USD'));
        expect(mockTraderStore.togglePayoutWheelPicker).toHaveBeenCalled();
    });
});
