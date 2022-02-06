import React from 'react';
import { render, screen } from '@testing-library/react';
import FormFooter from '../form-footer';

const MockFormFooter = props => {
    return (
        <FormFooter {...props}>
            <p>Lorem Ipsum</p>
        </FormFooter>
    );
};

describe('Testing form-footer component', () => {
    it('Should render children', () => {
        render(<MockFormFooter />);
        const textElement = screen.getByText('Lorem Ipsum');
        expect(textElement).toBeInTheDocument();
    });

    it('Container should render with a className prop', () => {
        const test_class = 'test-class';
        render(<MockFormFooter className={test_class} />);
        const container = screen.getByTestId('form-footer-container');
        expect(container).toHaveClass(test_class);
    });
});
