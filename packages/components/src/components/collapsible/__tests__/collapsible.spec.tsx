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
    is_non_interactive: false,
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

    it('should render component with specific className if passed children have no data-collapsible = true, but is_non_interactive is true', () => {
        render(
            <Collapsible {...mockedDefaultProps} is_non_interactive>
                <div>Child component</div>
            </Collapsible>
        );

        expect(screen.getByTestId(collapsibleTestId)).toHaveClass(collapsibleButtonClassName);
    });

    it('should change className if user clicks on handle button', () => {
        render(<Collapsible {...mockedDefaultProps} />);

        expect(screen.getByTestId(collapsibleTestId)).toHaveClass(expandedClassName);
        expect(screen.queryByTestId(collapsibleTestId)).not.toHaveClass(collapsedClassName);

        userEvent.click(screen.getByTestId(handleButtonTestId));

        expect(screen.getByTestId(collapsibleTestId)).toHaveClass(collapsedClassName);
        expect(screen.queryByTestId(collapsibleTestId)).not.toHaveClass(expandedClassName);
    });
});
