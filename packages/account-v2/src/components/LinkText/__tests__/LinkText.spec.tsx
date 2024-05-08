import React from 'react';
import { render, screen } from '@testing-library/react';
import { LinkText } from '../LinkText';

describe('LinkText', () => {
    it('should render a link text', () => {
        render(<LinkText href='link_text'>Link Text</LinkText>);
        const linkText = screen.getByRole('link', { name: /Link Text/i });
        expect(linkText).toBeInTheDocument();
    });
});
