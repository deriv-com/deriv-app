import React from 'react';
import { render, screen } from '@testing-library/react';
import ChatFooter from '../ChatFooter';

const mockProps = {
    isClosed: false,
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));
describe('ChatFooter', () => {
    it('should render the component as expected', () => {
        render(<ChatFooter {...mockProps} />);
        expect(screen.getByPlaceholderText('Enter message')).toBeInTheDocument();
    });
    it('should render the conversation closed message', () => {
        render(<ChatFooter {...{ ...mockProps, isClosed: true }} />);
        expect(screen.getByText('This conversation is closed')).toBeInTheDocument();
    });
});
