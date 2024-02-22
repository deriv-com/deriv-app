import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CloseHeader from '../CloseHeader';

const mockUseDevice = {
    isMobile: false,
};

jest.mock('@/hooks/useDevice', () => ({
    __esModule: true,
    default: jest.fn(() => mockUseDevice),
}));
let windowHistoryBackSpy: jest.SpyInstance<void, []>;

describe('CloseHeader', () => {
    it('should navigate back when cross icon is clicked', () => {
        windowHistoryBackSpy = jest.spyOn(window.history, 'back');
        render(<CloseHeader />);
        const crossIcon = screen.getByTestId('dt_p2p_v2_close_header_close_icon');
        userEvent.click(crossIcon);
        expect(windowHistoryBackSpy).toBeCalled();
    });
    it('should render the correct header title on desktop', () => {
        render(<CloseHeader />);
        expect(screen.queryByText('Cashier')).toBeInTheDocument();
    });
    it('should render the correct header title on mobile', () => {
        mockUseDevice.isMobile = true;
        render(<CloseHeader />);
        expect(screen.queryByText('Deriv P2P')).toBeInTheDocument();
    });
});
