import React from 'react';
import { render, screen } from '@testing-library/react';
import { MediaHeading } from 'App/Components/Elements/Media';

const test_children = 'Test Children';

describe('MediaHeading', () => {
    it('should render children inside of proper MediaHeading div container with className', () => {
        render(<MediaHeading>{test_children}</MediaHeading>);
        const test_props_children = screen.getByText(test_children);

        expect(test_props_children).toBeInTheDocument();
        expect(test_props_children).toHaveClass('media__heading');
    });
});
