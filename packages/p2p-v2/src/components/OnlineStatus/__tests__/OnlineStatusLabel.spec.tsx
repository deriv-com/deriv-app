import React from 'react';
import { getLastOnlineLabel } from '@/utils';
import { render, screen } from '@testing-library/react';
import OnlineStatusLabel from '../OnlineStatusLabel';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({
        isMobile: false,
    }),
}));

jest.mock('@/utils', () => ({
    ...jest.requireActual('@/utils'),
    getLastOnlineLabel: jest.fn().mockReturnValue('Seen 2 days ago'),
}));

describe('<OnlineStatusLabel/>', () => {
    it('should call the getLastOnlineLabel function with isOnline and lastOnlineTime', () => {
        render(<OnlineStatusLabel lastOnlineTime={1685446791} />);
        expect(getLastOnlineLabel).toHaveBeenCalledWith(false, 1685446791);
        expect(screen.getByText('Seen 2 days ago')).toBeInTheDocument();
    });
});
