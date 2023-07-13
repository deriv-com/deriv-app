import React from 'react';
import { render, screen } from '@testing-library/react';
import OnlineStatusIcon from '../online-status-icon';

describe('<OnlineStatusIcon/>', () => {
    it('should render the default state as offline', () => {
        render(<OnlineStatusIcon is_online={0} />);

        const icon = screen.getByTestId('dt_online_status_icon');
        expect(icon).toHaveClass('online-status__icon--offline');
    });

    it('should render online state when user is online', () => {
        render(<OnlineStatusIcon is_online={1} />);

        const icon = screen.getByTestId('dt_online_status_icon');
        expect(icon).toHaveClass('online-status__icon--online');
    });
});
