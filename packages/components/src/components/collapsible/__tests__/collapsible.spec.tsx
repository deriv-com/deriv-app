import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Collapsible from '../collapsible';

const collapsibleButtonClassName = 'dc-collapsible--has-collapsible-btn';
const expandedClassName = 'dc-collapsible--is-expanded';
const collapsedClassName = 'dc-collapsible--is-collapsed';
const collapsibleTestId = 'dt_collapsible';
const handleButtonTestId = 'dt_handle_button';

const mockedDefaultProps: React.ComponentProps<typeof Collapsible> = {
    children: <div data-collapsible={true}>Children Component</div>,
    onClick: jest.fn(),
};

describe('<Collapsible/>', () => {
    it('should render component with specific className if passed children have data-collapsible = true', () => {
        render(<Collapsible {...mockedDefaultProps} />);

        expect(screen.getByTestId(collapsibleTestId)).toHaveClass(collapsibleButtonClassName);
    });

    it('should render component without specific className if passed children have no data-collapsible = true', () => {
        render(
            <Collapsible {...mockedDefaultProps}>
                <div>Child component</div>
            </Collapsible>
        );

        expect(screen.getByTestId(collapsibleTestId)).not.toHaveClass(collapsibleButtonClassName);
    });

    it('should change className if user clicks on handle button', () => {
        render(<Collapsible {...mockedDefaultProps} />);

        expect(screen.getByTestId(collapsibleTestId)).toHaveClass(expandedClassName);
        expect(screen.queryByTestId(collapsibleTestId)).not.toHaveClass(collapsedClassName);

        userEvent.click(screen.getByTestId(handleButtonTestId));

        expect(screen.getByTestId(collapsibleTestId)).toHaveClass(collapsedClassName);
        expect(screen.queryByTestId(collapsibleTestId)).not.toHaveClass(expandedClassName);
    });

    it('should not change className if toggle on click is disabled (should_toggle_on_click = false)', () => {
        render(<Collapsible {...mockedDefaultProps} should_toggle_on_click={false} />);

        expect(screen.getByTestId(collapsibleTestId)).toHaveClass(expandedClassName);
        expect(screen.queryByTestId(collapsibleTestId)).not.toHaveClass(collapsedClassName);

        userEvent.click(screen.getByTestId(handleButtonTestId));

        expect(screen.getByTestId(collapsibleTestId)).toHaveClass(expandedClassName);
        expect(screen.queryByTestId(collapsibleTestId)).not.toHaveClass(collapsedClassName);
    });
});
