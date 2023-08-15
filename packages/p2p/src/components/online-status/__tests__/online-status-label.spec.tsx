import React from 'react';
import { render, screen } from '@testing-library/react';
import OnlineStatusLabel from '../online-status-label';

describe('<OnlineStatusLabel />', () => {
    it('should show online status label', () => {
        render(<OnlineStatusLabel is_online={1} />);
        expect(screen.getByText('Online')).toBeInTheDocument();
    });

    it(`should show user's last online status`, () => {
        render(<OnlineStatusLabel is_online={0} last_online_time={1619515200} />);
        expect(screen.getByText('Seen more than 6 months ago')).toBeInTheDocument();
    });
});
