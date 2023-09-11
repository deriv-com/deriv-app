import React from 'react';
import { render, screen } from '@testing-library/react';
import { FormFieldInfo } from '../form-field-info';
import userEvent from '@testing-library/user-event';

describe('FormFieldInfo', () => {
    it('should render the component', () => {
        render(<FormFieldInfo message='Info content' />);
        const popover = screen.getByTestId('dt_form-field-info__popover');
        expect(popover).toBeInTheDocument();
    });

    it('should toggle popover on click', () => {
        render(<FormFieldInfo message='Info content' />);
        const message = screen.queryByText('Info content');
        expect(message).not.toBeInTheDocument();

        const popover = screen.getByTestId('dt_form-field-info__popover');

        userEvent.click(popover);

        const content = screen.getByText('Info content');
        expect(content).toBeInTheDocument();
    });

    it('should close popover when clicking outside', () => {
        render(<FormFieldInfo message='Info content' />);
        const message = screen.queryByText('Info content');
        expect(message).not.toBeInTheDocument();

        const popover = screen.getByTestId('dt_form-field-info__popover');

        userEvent.click(popover);

        const content = screen.getByText('Info content');

        expect(content).toBeInTheDocument();

        userEvent.click(document.body);

        expect(content).not.toBeVisible();
    });
});
