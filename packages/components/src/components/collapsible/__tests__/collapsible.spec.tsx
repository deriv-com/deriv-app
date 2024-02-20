import React from 'react';
import { render, screen } from '@testing-library/react';
import Collapsible from '../collapsible';

const className = 'dc-collapsible--has-collapsible-btn';
const testId = 'dt_collapsible';
const mockedDefaultProps: React.ComponentProps<typeof Collapsible> = {
    children: <div data-collapsible={true}>Children Component</div>,
    onClick: jest.fn(),
    hide_collapsible_button: false,
};

describe('<Collapsible/>', () => {
    it('should render component with specific className if passed children have data-collapsible = true', () => {
        render(<Collapsible {...mockedDefaultProps} />);

        expect(screen.getByTestId(testId)).toHaveClass(className);
    });

    it('should render component without specific className if passed children have no data-collapsible = true', () => {
        render(
            <Collapsible {...mockedDefaultProps}>
                <div>Child component</div>
            </Collapsible>
        );

        expect(screen.getByTestId(testId)).not.toHaveClass(className);
    });

    it('should render component with specific className if passed children have no data-collapsible = true, but hide_collapsible_button is true', () => {
        render(
            <Collapsible {...mockedDefaultProps} hide_collapsible_button>
                <div>Child component</div>
            </Collapsible>
        );

        expect(screen.getByTestId(testId)).toHaveClass(className);
    });
});
