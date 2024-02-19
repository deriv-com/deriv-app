import React from 'react';
import { render, screen } from '@testing-library/react';
import SwipeableWrapper from '../swipeable-wrapper';

const className = 'dc-swipeable__nav-lift-up';
const mockedDefaultProps: React.ComponentProps<typeof SwipeableWrapper> = {
    children: <div>Children Components</div>,
};

describe('<Collapsible/>', () => {
    it('should render component with specific className if should_lift_up_navigation = true', () => {
        render(<SwipeableWrapper {...mockedDefaultProps} should_lift_up_navigation />);

        expect(screen.getByRole('navigation')).toHaveClass(className);
    });

    it('should render component without specific className if should_lift_up_navigation = false', () => {
        render(<SwipeableWrapper {...mockedDefaultProps} />);

        expect(screen.getByRole('navigation')).not.toHaveClass(className);
    });
});
