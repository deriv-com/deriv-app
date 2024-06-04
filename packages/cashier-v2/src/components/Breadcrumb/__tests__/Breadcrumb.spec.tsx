import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Breadcrumb from '../Breadcrumb';

const items = [
    { value: 0, text: 'Home' },
    { value: 1, text: 'About' },
    { value: 2, text: 'CFD' },
    { value: 3, text: 'mt5' },
];

describe('Breadcrumb Component', () => {
    it('Should render all provided items', () => {
        const onItemSelect = jest.fn();
        render(<Breadcrumb items={items} onItemSelect={onItemSelect} />);

        expect(screen.getAllByTestId('dt_breadcrumb_item').length).toBe(4);
    });

    it('Should be able to click on items', () => {
        const onItemSelect = jest.fn();
        render(<Breadcrumb items={items} onItemSelect={onItemSelect} />);
        userEvent.click(screen.getByText(/CFD/i));

        expect(onItemSelect).toHaveBeenCalledTimes(1);
    });
});
