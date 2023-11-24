import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import SwipeableNotification from '../swipeable-notification';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { useSwipeable } from 'react-swipeable';

jest.mock('react-swipeable', () => ({
    useSwipeable: jest.fn(() => ({
        onMouseDown: jest.fn(),
    })),
}));

describe('SwipeableNotification', () => {
    const content = 'Notification content';

    const renderwithRouter = (props: React.ComponentProps<typeof SwipeableNotification> = {}) => {
        render(
            <BrowserRouter>
                <SwipeableNotification {...props}>{content}</SwipeableNotification>
            </BrowserRouter>
        );
    };

    it('should render the correct content', () => {
        const onMouseDown = jest.fn();
        (useSwipeable as jest.Mock).mockReturnValueOnce({ onMouseDown });
        renderwithRouter();

        const notification = screen.getByText(content);
        expect(notification).toBeInTheDocument();
        const link = screen.getByRole('link');
        // there is no mouseDown event in userEvent, hence using fireEvent
        fireEvent.mouseDown(link);
        expect(onMouseDown).toBeCalled();
    });
    it('should render 15s ago timestamp', () => {
        const fifteen_sec_ago = Math.floor(Date.now() / 1000) - 15;
        renderwithRouter({ timestamp: fifteen_sec_ago });

        expect(screen.getByText('15s ago')).toBeInTheDocument();
    });
    it('should render "now" timestamp', () => {
        const five_sec_ago = Math.floor(Date.now() / 1000) - 5;
        renderwithRouter({ timestamp: five_sec_ago });

        expect(screen.getByText('now')).toBeInTheDocument();
    });
    it('should hide notifications using a memoized function when visibility_duration_ms is passed', () => {
        const onUnmountCallback = jest.fn();
        jest.spyOn(React, 'useMemo').mockImplementationOnce(() => {
            onUnmountCallback();
            return { cancel: jest.fn() };
        });
        renderwithRouter({ visibility_duration_ms: 3000, onUnmount: onUnmountCallback, timestamp: 1234567890 });
        expect(onUnmountCallback).toBeCalled();
    });
    it('should redirect to URL passed as redirect_to', () => {
        renderwithRouter({ redirect_to: '/test_url' });
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/test_url');
        userEvent.click(link);
        expect(window.location.pathname).toEqual('/test_url');
    });
    it('should apply correct classname in case of failure', () => {
        renderwithRouter({ is_failure: true });
        expect(screen.getByRole('link')).toHaveClass('swipeable-notification--failure');
    });
    it('should apply correct classname in case of failure', () => {
        renderwithRouter({ is_success: true });
        expect(screen.getByRole('link')).toHaveClass('swipeable-notification--success');
    });
});
