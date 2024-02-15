import React from 'react';
import { render, screen } from '@testing-library/react';
import OnlineStatusIcon from '../OnlineStatusIcon';

describe('<OnlineStatusIcon/>', () => {
    it('should render the default state as offline', () => {
        render(<OnlineStatusIcon isOnline={false} />);

        const icon = screen.getByTestId('dt_p2p_v2_online_status_icon');
        expect(icon).toHaveClass('p2p-v2-online-status__icon--offline');
    });

    it('should render online state when user is online', () => {
        render(<OnlineStatusIcon isOnline />);

        const icon = screen.getByTestId('dt_p2p_v2_online_status_icon');
        expect(icon).toHaveClass('p2p-v2-online-status__icon--online');
    });
});
