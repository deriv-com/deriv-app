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
        expect(screen.queryByText('Info content')).not.toBeInTheDocument();
        userEvent.click(screen.getByTestId('dt_form-field-info__popover'));
        expect(screen.getByText('Info content')).toBeInTheDocument();
    });

    it('should close popover when clicking outside', () => {
        render(<FormFieldInfo message='Info content' />);
        expect(screen.queryByText('Info content')).not.toBeInTheDocument();
        userEvent.click(screen.getByTestId('dt_form-field-info__popover'));

        const content = screen.getByText('Info content');
        expect(content).toBeInTheDocument();
        userEvent.click(document.body);
        expect(content).not.toBeVisible();
    });
});
