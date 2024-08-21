import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TradingPlatformIcon, { PlatformIcons } from '../trading-platform-icon';

type TMockIconProps = {
    className?: string;
    onClick?: () => void;
    width?: number;
    height?: number;
};

// Mock the AccountsDerivCtraderIcon component
jest.mock('@deriv/quill-icons', () => ({
    AccountsDmt5FinancialIcon: ({ className, onClick, width, height }: TMockIconProps) => (
        <div
            data-testid='cfd_trading_platform_mocked_icon'
            className={className}
            onClick={onClick}
            data-width={width}
            data-height={height}
        >
            Mocked Icon
        </div>
    ),
}));

describe('TradingPlatformIcon', () => {
    it('renders the icon with default props', () => {
        render(<TradingPlatformIcon icon='Financial' size={24} />);
        const icon = screen.getByTestId('cfd_trading_platform_mocked_icon');
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveAttribute('data-width', '24');
        expect(icon).toHaveAttribute('data-height', '24');
    });

    it('applies custom className', () => {
        render(<TradingPlatformIcon icon='Financial' size={24} className='custom-class' />);
        const icon = screen.getByTestId('cfd_trading_platform_mocked_icon');
        expect(icon).toHaveClass('custom-class');
    });

    it('calls onClick handler when clicked', () => {
        const handleClick = jest.fn();
        render(<TradingPlatformIcon icon='Financial' size={24} onClick={handleClick} />);
        const icon = screen.getByTestId('cfd_trading_platform_mocked_icon');
        fireEvent.click(icon);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    // it('renders null for unknown icon', () => {
    //     // @ts-ignore - Intentionally passing an invalid icon to test error handling
    //     const { container } = render(<TradingPlatformIcon icon='Unknown' />);
    //     expect(container).toBeEmptyDOMElement();
    // });

    // it('renders all platform icons', () => {
    //     Object.keys(PlatformIcons).forEach(iconKey => {
    //         const { unmount } = render(<TradingPlatformIcon icon={iconKey as keyof typeof PlatformIcons} />);
    //         const icon = screen.getByTestId('cfd_trading_platform_mocked_icon');
    //         expect(icon).toBeInTheDocument();
    //         unmount();
    //     });
    // });
});
