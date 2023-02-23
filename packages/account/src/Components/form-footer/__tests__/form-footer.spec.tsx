import React from 'react';
import FormFooter, { TFormFooter } from '../form-footer';
import { render, screen } from '@testing-library/react';

const MockFormFooter = (props: TFormFooter) => {
    return (
        <FormFooter {...props}>
            <p>Lorem Ipsum</p>
        </FormFooter>
    );
};

describe('Testing form-footer component', () => {
    it('Should render children', () => {
        render(<MockFormFooter />);
        expect(screen.getByText('Lorem Ipsum')).toBeInTheDocument();
    });

    it('Container should render with a className prop', () => {
        const test_class = 'test-class';
        render(<MockFormFooter className={test_class} />);
        expect(screen.getByTestId('form-footer-container')).toHaveClass(test_class);
    });
});
