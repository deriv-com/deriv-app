import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PayoutPerPointInput from '../payout-per-point-input';
import { useDevice } from '@deriv/components';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    useDevice: jest.fn(),
}));

jest.mock('@deriv/translations', () => ({
    Localize: ({ i18n_default_text }) => <span>{i18n_default_text}</span>,
    localize: text => text,
}));

jest.mock('@deriv/quill-icons', () => ({
    LabelPairedChevronsDownCaptionRegularIcon: ({ width, height, style }) => (
        <svg data-testid='LabelPairedChevronsDownCaptionRegularIcon' width={width} height={height} style={style}>
            <path d='M0 0h24v24H0z' fill='none' />
            <path d='M12 2L2 22h20L12 2zm0 3.3L17.4 20H6.6L12 5.3zm0 7.7c.55 0 1 .45 1 1v2h-2v-2c0-.55.45-1 1-1zm-1 3h2v2h-2v-2z' />
        </svg>
    ),
    LabelPairedChevronsUpCaptionRegularIcon: ({ width, height, style }) => (
        <svg data-testid='LabelPairedChevronsUpCaptionRegularIcon' width={width} height={height} style={style}>
            <path d='M0 0h24v24H0z' fill='none' />
            <path d='M12 2L2 22h20L12 2zm0 3.3L17.4 20H6.6L12 5.3zm0 7.7c.55 0 1 .45 1 1v2h-2v-2c0-.55.45-1 1-1zm-1 3h2v2h-2v-2z' />
        </svg>
    ),
}));

jest.mock('../../../Form/WheelPicker', () =>
    jest.fn(({ options, defaultValue, onClick, currency }) => (
        <div role='button' onClick={() => onClick(defaultValue)}>
            MockWheelPicker - {currency}
        </div>
    ))
);

describe('PayoutPerPointInput', () => {
    const defaultProps = {
        payoutOptions: [10, 20, 30],
        onPayoutClick: jest.fn(),
        selectedBarrier: '5',
        defaultPayout: 10,
        currency: 'USD',
        tooltipText: 'Tooltip text',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly on desktop device', () => {
        (useDevice as jest.Mock).mockReturnValue({ is_desktop: true });

        render(<PayoutPerPointInput {...defaultProps} />);

        expect(screen.getByText('Payout per Point')).toBeInTheDocument();
        expect(screen.getByText('Distance to current spot')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
    });

    test('does not render on mobile device', () => {
        (useDevice as jest.Mock).mockReturnValue({ is_desktop: false });

        render(<PayoutPerPointInput {...defaultProps} />);

        expect(screen.queryByText('Payout per Point')).not.toBeInTheDocument();
    });

    test('WheelPicker component is rendered with correct props', () => {
        (useDevice as jest.Mock).mockReturnValue({ is_desktop: true });

        render(<PayoutPerPointInput {...defaultProps} />);

        const wheelPicker = screen.getByRole('button', { name: /USD/i });
        expect(wheelPicker).toBeInTheDocument();
    });

    test('barrier text and icon are displayed correctly for positive barrier', () => {
        (useDevice as jest.Mock).mockReturnValue({ is_desktop: true });

        render(<PayoutPerPointInput {...defaultProps} selectedBarrier='5' />);

        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByTestId('LabelPairedChevronsUpCaptionRegularIcon')).toBeInTheDocument();
    });

    test('barrier text and icon are displayed correctly for negative barrier', () => {
        (useDevice as jest.Mock).mockReturnValue({ is_desktop: true });

        render(<PayoutPerPointInput {...defaultProps} selectedBarrier='-5' />);

        expect(screen.getByText('-5')).toBeInTheDocument();
        expect(screen.getByTestId('LabelPairedChevronsDownCaptionRegularIcon')).toBeInTheDocument();
    });
});
