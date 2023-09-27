import React from 'react';
import { render, screen } from '@testing-library/react';
import Fieldset from '../fieldset';

const test_children_text = 'Test';
const test_children = <div>{test_children_text}</div>;
const test_header_text = 'Header';
const test_className = 'test_className';
const test_popover_text = 'Test Popover';

describe('Fieldset', () => {
    it('should render Fieldset component with children but without header by default', () => {
        render(<Fieldset className={test_className}>{test_children}</Fieldset>);

        expect(screen.getByText(test_children_text)).toBeInTheDocument();
        expect(screen.queryByText(test_header_text)).not.toBeInTheDocument();
    });
    it('should render Fieldset component with header and specific className if it was passed in props and is_center !== true', () => {
        render(
            <Fieldset className={test_className} header={test_header_text}>
                {test_children}
            </Fieldset>
        );
        const header = screen.getByText(test_header_text);

        expect(header).toBeInTheDocument();
        expect(header).toHaveClass('trade-container__fieldset-info trade-container__fieldset-info--left');
    });
    it('should render header with a specific class if is_center === true', () => {
        render(
            <Fieldset className={test_className} header={test_header_text} is_center>
                {test_children}
            </Fieldset>
        );
        const header = screen.getByText(test_header_text);

        expect(header).toBeInTheDocument();
        expect(header).not.toHaveClass('trade-container__fieldset-info--left');
    });
    it('should render popover for header if it was passed in props', () => {
        render(
            <Fieldset className={test_className} header={test_header_text} is_center header_tooltip={test_popover_text}>
                {test_children}
            </Fieldset>
        );

        expect(screen.getByText(test_header_text)).toBeInTheDocument();
        expect(screen.getByTestId('dt_popover_wrapper')).toBeInTheDocument();
    });
});
