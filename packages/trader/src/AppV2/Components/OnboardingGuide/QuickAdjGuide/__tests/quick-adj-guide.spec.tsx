import React from 'react';
import { render, act, waitFor, screen } from '@testing-library/react';
import { useLocalStorageData } from '@deriv/hooks';
import userEvent from '@testing-library/user-event';
import { getLocalStorage } from '@deriv/utils';
import QuickAdjGuide from '../quick-adj-guide';
import { TGuideContainerProps } from '../../GuideForPages/guide-container';

let lastPassedProps;

jest.mock('@deriv/hooks', () => ({
    useLocalStorageData: jest.fn(),
}));

jest.mock('@deriv/utils', () => ({
    getLocalStorage: jest.fn(),
}));

jest.mock('@deriv/translations', () => ({
    Localize: ({ i18n_default_text }: { i18n_default_text: string }) => i18n_default_text,
}));

jest.mock('../../GuideForPages/guide-container', () => ({
    __esModule: true,
    default: (props: TGuideContainerProps) => {
        lastPassedProps = props;
        return (
            <div data-testid='mock-guide-container' data-should-run={props.should_run}>
                <button onClick={props.callback} data-testid='callback-button'>
                    Close Guide
                </button>
            </div>
        );
    },
}));

describe('QuickAdjGuide', () => {
    let mockSetGuideDtraderV2: jest.Mock;

    beforeEach(() => {
        jest.useFakeTimers();
        lastPassedProps = null;
        mockSetGuideDtraderV2 = jest.fn();
        (useLocalStorageData as jest.Mock).mockReturnValue([
            {
                trade_param_quick_adjustment: false,
            },
            mockSetGuideDtraderV2,
        ]);
        (getLocalStorage as jest.Mock).mockReturnValue({
            trade_param_quick_adjustment: false,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });

    it('should not render GuideContainer initially', () => {
        render(<QuickAdjGuide is_minimized_visible={false} />);
        expect(screen.queryByTestId('mock-guide-container')).not.toBeInTheDocument();
    });
    it('should show guide when minimized and visible', async () => {
        render(<QuickAdjGuide is_minimized={true} is_minimized_visible={true} />);

        act(() => {
            jest.advanceTimersByTime(300);
        });

        await waitFor(() => {
            expect(screen.getByTestId('mock-guide-container')).toBeInTheDocument();
        });

        expect(mockSetGuideDtraderV2).toHaveBeenCalledWith({
            trade_param_quick_adjustment: true,
        });
    });
    it('should not show guide when already shown (trade_param_quick_adjustment is true)', () => {
        (useLocalStorageData as jest.Mock).mockReturnValue([
            {
                trade_param_quick_adjustment: true,
            },
            mockSetGuideDtraderV2,
        ]);

        render(<QuickAdjGuide is_minimized={true} is_minimized_visible={true} />);

        act(() => {
            jest.advanceTimersByTime(300);
        });

        expect(screen.queryByTestId('mock-guide-container')).not.toBeInTheDocument();
    });
    it('should not show guide when not minimized', () => {
        render(<QuickAdjGuide is_minimized={false} is_minimized_visible={true} />);

        act(() => {
            jest.advanceTimersByTime(300);
        });

        expect(screen.queryByTestId('mock-guide-container')).not.toBeInTheDocument();
    });
    it('should not show guide when not visible', () => {
        render(<QuickAdjGuide is_minimized={true} is_minimized_visible={false} />);

        act(() => {
            jest.advanceTimersByTime(300);
        });

        expect(screen.queryByTestId('mock-guide-container')).not.toBeInTheDocument();
    });
    it('should clean up timeout and hide guide on unmount', () => {
        const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

        const { unmount } = render(<QuickAdjGuide is_minimized={true} is_minimized_visible={true} />);

        act(() => {
            jest.advanceTimersByTime(300);
        });

        unmount();

        expect(clearTimeoutSpy).toHaveBeenCalled();
    });
    it('should use latest localStorage value when showing guide', async () => {
        const mockLatestStorage = {
            some_other_setting: true,
            trade_param_quick_adjustment: false,
        };

        (getLocalStorage as jest.Mock).mockReturnValue(mockLatestStorage);

        render(<QuickAdjGuide is_minimized={true} is_minimized_visible={true} />);

        act(() => {
            jest.advanceTimersByTime(300);
        });

        await waitFor(() => {
            expect(mockSetGuideDtraderV2).toHaveBeenCalledWith({
                ...mockLatestStorage,
                trade_param_quick_adjustment: true,
            });
        });
    });
    it('should handle callback to hide guide', async () => {
        render(<QuickAdjGuide is_minimized={true} is_minimized_visible={true} />);

        act(() => {
            jest.advanceTimersByTime(300);
        });

        await waitFor(() => {
            expect(screen.getByTestId('mock-guide-container')).toBeInTheDocument();
        });

        const callback_button = screen.getByTestId('callback-button');
        await userEvent.click(callback_button);

        await waitFor(() => {
            expect(screen.queryByTestId('mock-guide-container')).not.toBeInTheDocument();
        });
    });
});
