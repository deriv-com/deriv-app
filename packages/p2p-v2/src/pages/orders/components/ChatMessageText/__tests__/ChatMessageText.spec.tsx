import React from 'react';
import { render, screen } from '@testing-library/react';
import ChatMessageText from '../ChatMessageText';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isDesktop: true }),
}));

describe('ChatMessageText', () => {
    it('should render the component as expected with the children', () => {
        const children = 'this is the message';
        render(<ChatMessageText color='general'>{children}</ChatMessageText>);
        expect(screen.getByText('this is the message')).toBeInTheDocument();
    });
});
