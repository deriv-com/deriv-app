import React from 'react';
import { render, screen } from '@testing-library/react';
import MediaItem from '../media-item';

const test_children = 'Test Children';

describe('MediaItem', () => {
    it('should render children inside of proper MediaItem div container with className', () => {
        render(<MediaItem>{test_children}</MediaItem>);
        const test_props_children = screen.getByText(test_children);

        expect(test_props_children).toBeInTheDocument();
        expect(test_props_children).toHaveClass('media');
    });
});
