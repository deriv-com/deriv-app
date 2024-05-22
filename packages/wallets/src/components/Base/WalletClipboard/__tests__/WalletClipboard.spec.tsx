import React from 'react';
import { useCopyToClipboard, useHover } from 'usehooks-ts';
import { fireEvent, render, screen } from '@testing-library/react';
import useDevice from '../../../../hooks/useDevice';
import WalletClipboard from '../WalletClipboard';

jest.mock('usehooks-ts', () => ({
    useCopyToClipboard: jest.fn(),
    useHover: jest.fn(),
}));

jest.mock('../../../../hooks/useDevice', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('WalletClipboard', () => {
    let mockCopy: jest.Mock;
    const mockUseDevice = useDevice as jest.Mock;

    beforeEach(() => {
        mockCopy = jest.fn();
        (useCopyToClipboard as jest.Mock).mockReturnValue([null, mockCopy]);
        (useHover as jest.Mock).mockReturnValue(false);
        mockUseDevice.mockReturnValue({ isMobile: false });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render the button with copy icon initially', () => {
        render(<WalletClipboard textCopy='Sample text to copy' />);
        const button = screen.getByRole('button');

        expect(button).toBeInTheDocument();
        expect(screen.getByTestId('dt_legacy_copy_icon')).toBeInTheDocument();
    });
    it('should render the button with won icon when copied', () => {
        render(<WalletClipboard textCopy='Sample text to copy' />);
        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(screen.getByTestId('dt_legacy_won_icon')).toBeInTheDocument();
    });
    it('should call copy function with textCopy when button is clicked', () => {
        render(<WalletClipboard textCopy='Sample text to copy' />);
        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(mockCopy).toHaveBeenCalledWith('Sample text to copy');
    });
    it('should show tooltip with "Copy" message when hovered', () => {
        (useHover as jest.Mock).mockReturnValue(true);
        render(<WalletClipboard textCopy='Sample text to copy' />);

        expect(screen.getByText('Copy')).toBeInTheDocument();
    });
    it('should show tooltip with "Copied!" message when clicked and hovered', () => {
        (useHover as jest.Mock).mockReturnValue(true);
        render(<WalletClipboard textCopy='Sample text to copy' />);
        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
    it('should clear timeout on unmount', () => {
        jest.useFakeTimers();
        const { unmount } = render(<WalletClipboard textCopy='Sample text to copy' />);
        fireEvent.click(screen.getByRole('button'));
        unmount();

        jest.runAllTimers();
        expect(clearTimeout).toHaveBeenCalled();
    });
    it('should not show tooltip on mobile', () => {
        mockUseDevice.mockReturnValue({ isMobile: true });
        render(<WalletClipboard textCopy='Sample text to copy' />);
        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(screen.queryByText('Copy')).not.toBeInTheDocument();
        expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
    });
    it('should reset the icon and message after 2 seconds', () => {
        jest.useFakeTimers();
        (useHover as jest.Mock).mockReturnValue(true);
        render(<WalletClipboard textCopy='Sample text to copy' />);
        const button = screen.getByRole('button');

        fireEvent.click(button);

        expect(screen.getByText('Copied!')).toBeInTheDocument();
        expect(screen.getByTestId('dt_legacy_won_icon')).toBeInTheDocument();

        jest.advanceTimersByTime(2000);

        expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
        expect(screen.getByTestId('dt_legacy_copy_icon')).toBeInTheDocument();
    });
});
