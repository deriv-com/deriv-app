import React from 'react';
import { render, screen } from '@testing-library/react';
import ChatHeader from '../ChatHeader';

const mockProps = {
    isOnline: 1 as 0 | 1,
    lastOnlineTime: 1709810646,
    nickname: 'client CR90000313',
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

describe('ChatHeader', () => {
    it('should render the component as expected with the passed props', () => {
        render(<ChatHeader {...mockProps} />);
        expect(screen.getByText('client CR90000313')).toBeInTheDocument();
    });
});
