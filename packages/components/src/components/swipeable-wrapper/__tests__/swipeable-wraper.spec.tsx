import React from 'react';
import { render, screen } from '@testing-library/react';
import SwipeableWrapper from '../swipeable-wrapper';

const className = 'dc-swipeable__nav-elevated';
const mockedDefaultProps: React.ComponentProps<typeof SwipeableWrapper> = {
    children: <div>Child Component</div>,
};

describe('<Collapsible/>', () => {
    it('should render component with specific className if should_elevate_navigation = true', () => {
        render(<SwipeableWrapper {...mockedDefaultProps} should_elevate_navigation />);

        expect(screen.getByRole('navigation')).toHaveClass(className);
    });

    it('should render component without specific className if should_elevate_navigation = false', () => {
        render(<SwipeableWrapper {...mockedDefaultProps} />);

        expect(screen.getByRole('navigation')).not.toHaveClass(className);
    });
});
