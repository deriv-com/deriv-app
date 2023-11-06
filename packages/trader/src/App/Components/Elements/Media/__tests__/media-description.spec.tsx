import React from 'react';
import { render, screen } from '@testing-library/react';
import { MediaDescription } from 'App/Components/Elements/Media';

const test_children = 'Test Children';

describe('MediaDescription', () => {
    it('should render children inside of proper MediaDescription div container with className', () => {
        render(<MediaDescription>{test_children}</MediaDescription>);
        const test_props_children = screen.getByText(test_children);

        expect(test_props_children).toBeInTheDocument();
        expect(test_props_children).toHaveClass('media__description');
    });
});
