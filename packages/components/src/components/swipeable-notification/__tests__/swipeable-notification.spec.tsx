import React from 'react';
import { render, screen } from '@testing-library/react';
import SwipeableNotification from '../swipeable-notification';

describe('SwipeableNotification', () => {
    const content = 'Notification content';

    //     props_to_test = {
    //         classname: 'swipeable-notification',
    //         is_failure: false,
    //         is_success: false,
    //         onUnmount: jest.fn(),
    //         redirect_to: '',
    //         timestamp: 1234567890,
    //         visibility_duration_ms: 3000,
    //     };

    it('should render the correct content', () => {
        render(<SwipeableNotification>{content}</SwipeableNotification>);

        expect(screen.getByText(content)).toBeInTheDocument();
    });
    it('should render 15s ago timestamp', () => {
        const fifteen_sec_ago = Date.now() - 15 / 1000;
        render(<SwipeableNotification timestamp={fifteen_sec_ago}>{content}</SwipeableNotification>);

        expect(screen.getByText('15s ago')).toBeInTheDocument();
    });
    it('should render "now" timestamp', () => {
        const five_sec_ago = Date.now() - 5 / 1000;
        render(<SwipeableNotification timestamp={five_sec_ago}>{content}</SwipeableNotification>);

        expect(screen.getByText('now')).toBeInTheDocument();
    });
    it('should hide notifications after visibility_duration_ms and call onUnmount after + 300 seconds of animation', async () => {
        const onUnmountCallback = jest.fn();
        render(
            <SwipeableNotification visibility_duration_ms={3000} onUnmount={onUnmountCallback}>
                {content}
            </SwipeableNotification>
        );
        jest.advanceTimersByTime(3300);
        expect(onUnmountCallback).toBeCalled();
    });
});
