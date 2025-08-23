import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CompareAccountsCarouselButton from '../CompareAccountsCarouselButton';

jest.mock('../../../../../components/Base', () => ({
    IconButton: ({
        children,
        className,
        disabled,
        icon,
        onClick,
    }: {
        children: React.ReactNode;
        className: string;
        disabled: boolean;
        icon: React.ReactNode;
        onClick: () => void;
    }) => (
        <button
            className={className}
            data-testid='dt_compare_accounts_carousel_button'
            disabled={disabled}
            onClick={onClick}
        >
            {icon}
            {children}
        </button>
    ),
}));

describe('CompareAccountsCarouselButton', () => {
    const defaultProps = {
        enabled: true,
        isNext: false,
        isRtl: false,
        onClick: jest.fn(),
    };

    it('renders correctly for previous button', () => {
        render(<CompareAccountsCarouselButton {...defaultProps} />);

        expect(screen.getByTestId('dt_compare_accounts_carousel_button')).toHaveClass(
            'wallets-compare-accounts-carousel-button--prev'
        );
        expect(screen.getByTestId('dt_compare_accounts_carousel_prev_ltr_icon')).toBeInTheDocument();
    });

    it('renders correctly for next button', () => {
        render(<CompareAccountsCarouselButton {...defaultProps} isNext={true} />);

        expect(screen.getByTestId('dt_compare_accounts_carousel_button')).toHaveClass(
            'wallets-compare-accounts-carousel-button--next'
        );
        expect(screen.getByTestId('dt_compare_accounts_carousel_next_ltr_icon')).toBeInTheDocument();
    });

    it('handles RTL for previous button', () => {
        render(<CompareAccountsCarouselButton {...defaultProps} isRtl={true} />);

        expect(screen.getByTestId('dt_compare_accounts_carousel_prev_rtl_icon')).toBeInTheDocument();
    });

    it('handles RTL for next button', () => {
        render(<CompareAccountsCarouselButton {...defaultProps} isNext={true} isRtl={true} />);

        expect(screen.getByTestId('dt_compare_accounts_carousel_next_rtl_icon')).toBeInTheDocument();
    });

    it('disables button when enabled is false', () => {
        render(<CompareAccountsCarouselButton {...defaultProps} enabled={false} />);

        expect(screen.getByTestId('dt_compare_accounts_carousel_button')).toBeDisabled();
    });

    it('calls onClick event when button is clicked', async () => {
        const mockOnClick = jest.fn();
        render(<CompareAccountsCarouselButton {...defaultProps} onClick={mockOnClick} />);

        await userEvent.click(screen.getByTestId('dt_compare_accounts_carousel_button'));
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
});
