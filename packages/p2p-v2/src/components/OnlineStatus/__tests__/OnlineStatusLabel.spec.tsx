import React from 'react';
import { getLastOnlineLabel } from '@/utils';
import { render, screen } from '@testing-library/react';
import OnlineStatusLabel from '../OnlineStatusLabel';

jest.mock('@/utils', () => ({
    ...jest.requireActual('@/utils'),
    getLastOnlineLabel: jest.fn().mockReturnValue('Seen 2 days ago'),
}));

describe('<OnlineStatusLabel/>', () => {
    it('should call the getLastOnlineLabel function with is_online and last_online_time', () => {
        render(<OnlineStatusLabel isOnline={0} lastOnlineTime={1685446791} />);
        expect(getLastOnlineLabel).toHaveBeenCalledWith(0, 1685446791);
        expect(screen.getByText('Seen 2 days ago')).toBeInTheDocument();
    });
});
