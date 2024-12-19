import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OnboardingGuide from '../onboarding-guide';
import { useLocalStorageData } from '@deriv/hooks';
import { getLocalStorage } from '@deriv/utils';

const trading_modal_text = 'Welcome to the Deriv Trader';
const positions_modal_text = 'View your positions';

jest.mock('@deriv/hooks', () => ({
    useLocalStorageData: jest.fn(),
}));

jest.mock('@deriv/utils', () => ({
    getLocalStorage: jest.fn(),
}));

jest.mock('../onboarding-video', () => jest.fn(() => <div>OnboardingVideo</div>));

describe('OnboardingGuide', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        const mockSetGuideDtraderV2 = jest.fn();
        (useLocalStorageData as jest.Mock).mockReturnValue([
            { trade_page: false, positions_page: false },
            mockSetGuideDtraderV2,
        ]);
        (getLocalStorage as jest.Mock).mockReturnValue({
            trade_page: false,
            positions_page: false,
        });
    });
    it('should render Modal with correct content for trading page after 800ms', async () => {
        jest.useFakeTimers();
        render(<OnboardingGuide />);

        act(() => {
            jest.advanceTimersByTime(800);
        });

        expect(screen.getByText('OnboardingVideo')).toBeInTheDocument();
        expect(screen.getByText(trading_modal_text)).toBeInTheDocument();
        expect(screen.getByText("Let's go")).toBeInTheDocument();

        jest.useRealTimers();
    });
    it('should render Modal with correct content for positions page after 800ms', async () => {
        jest.useFakeTimers();
        render(<OnboardingGuide type='positions_page' />);

        act(() => {
            jest.advanceTimersByTime(800);
        });

        expect(screen.getByText('OnboardingVideo')).toBeInTheDocument();
        expect(screen.getByText(positions_modal_text)).toBeInTheDocument();
        expect(screen.getByText('Got it')).toBeInTheDocument();

        jest.useRealTimers();
    });
    it('should update localStorage and close modal when "Got it" is clicked', async () => {
        const mockSetGuideDtraderV2 = jest.fn();
        (useLocalStorageData as jest.Mock).mockReturnValue([{ positions_page: false }, mockSetGuideDtraderV2]);
        (getLocalStorage as jest.Mock).mockReturnValue({ positions_page: false });

        jest.useFakeTimers();

        render(<OnboardingGuide type='positions_page' />);

        act(() => {
            jest.advanceTimersByTime(800);
        });

        await userEvent.click(screen.getByText('Got it'));

        expect(mockSetGuideDtraderV2).toHaveBeenCalledWith({
            positions_page: true,
        });

        jest.useRealTimers();
    });
    it('should execute callback when modal is closed', async () => {
        const callback = jest.fn();
        jest.useFakeTimers();
        render(<OnboardingGuide callback={callback} />);

        act(() => {
            jest.advanceTimersByTime(800);
        });

        await userEvent.click(screen.getByText("Let's go"));

        expect(callback).toHaveBeenCalled();
        jest.useRealTimers();
    });

    it('should handle dark mode correctly', async () => {
        jest.useFakeTimers();
        render(<OnboardingGuide is_dark_mode_on />);

        act(() => {
            jest.advanceTimersByTime(800);
        });

        expect(screen.getByText('OnboardingVideo')).toBeInTheDocument();

        jest.useRealTimers();
    });
    it('should not show modal if guide is already completed', () => {
        (useLocalStorageData as jest.Mock).mockReturnValue([{ trade_page: true }, jest.fn()]);

        jest.useFakeTimers();
        render(<OnboardingGuide />);

        act(() => {
            jest.advanceTimersByTime(800);
        });

        expect(screen.queryByText(trading_modal_text)).not.toBeInTheDocument();
        jest.useRealTimers();
    });
});
