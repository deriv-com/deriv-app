import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BarrierSelector from '../barrier-selector';
import { useTraderStore } from 'Stores/useTraderStores';
import { useDevice } from '@deriv-com/ui';
import { localize } from '@deriv/translations';

jest.mock('Stores/useTraderStores', () => ({
    useTraderStore: jest.fn(),
}));

jest.mock('@deriv-com/ui', () => ({
    useDevice: jest.fn(),
}));

jest.mock('@deriv/components', () => ({
    Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

jest.mock('@deriv/translations', () => ({
    Localize: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
    localize: jest.fn(),
}));

jest.mock('Modules/Trading/Components/Elements/PayoutPerPoint/payout-per-point-input', () =>
    jest.fn(() => <div>PayoutPerPointInput</div>)
);

jest.mock('@deriv/quill-icons', () => ({
    LabelPairedChevronsDownCaptionRegularIcon: () => <svg data-testid='LabelPairedChevronsDownCaptionRegularIcon' />,
    LabelPairedChevronsUpCaptionRegularIcon: () => <svg data-testid='LabelPairedChevronsUpCaptionRegularIcon' />,
}));

describe('BarrierSelector', () => {
    const mockUseTraderStore = {
        barrier_1: '100',
        payout_choices: [10, 20, 30],
        setPayoutWheelPicker: jest.fn(),
        togglePayoutWheelPicker: jest.fn(),
        payout_per_point: 20,
        currency: 'USD',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useTraderStore as jest.Mock).mockReturnValue(mockUseTraderStore);
    });

    test('renders correctly on desktop devices', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });

        render(<BarrierSelector />);

        expect(screen.getByText('PayoutPerPointInput')).toBeInTheDocument();
    });

    test('toggles the barriers table correctly', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });

        render(<BarrierSelector />);

        fireEvent.click(screen.getByText(mockUseTraderStore.payout_per_point));

        expect(mockUseTraderStore.togglePayoutWheelPicker).toHaveBeenCalled();
    });
});
