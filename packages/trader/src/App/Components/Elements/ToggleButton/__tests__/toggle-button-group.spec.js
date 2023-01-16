import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ToggleButtonGroup from '../toggle-button-group.jsx';
import ToggleButton from '../toggle-button.jsx';

const MockToggleButtonGroup = ({ value, className, multiple, onChange }) => (
    <ToggleButtonGroup value={value} className={className} onChange={onChange} multiple={multiple}>
        <ToggleButton value='first-button'>first test button</ToggleButton>
        {multiple && <ToggleButton value='second-button'>second test button</ToggleButton>}
    </ToggleButtonGroup>
);

describe('ToggleButtonGroup', () => {
    it('should have "test-class" class when "className" passed', () => {
        render(<MockToggleButtonGroup className='test-class' />);
        expect(screen.getByTestId('dt_toggle_button_group')).toHaveClass('test-class');
    });

    it('should be called when the "ToggleButton" is clicked with value of the button', () => {
        const mock_click = jest.fn();
        render(<MockToggleButtonGroup onChange={mock_click} />);
        const button = screen.getByRole('button', { name: 'first test button' });
        userEvent.click(button);
        expect(mock_click).toHaveBeenCalledTimes(1);
        expect(mock_click.mock.calls[0][1]).toBe('first-button');
    });

    it('should be called when the "ToggleButton" is clicked with an empty array', () => {
        const mock_click = jest.fn();
        render(<MockToggleButtonGroup value={['first-button']} multiple onChange={mock_click} />);
        const button = screen.getByRole('button', { name: 'first test button' });
        userEvent.click(button);
        expect(mock_click).toHaveBeenCalledTimes(1);
        expect(Array.isArray(mock_click.mock.calls[0][1])).toBeTruthy();
        expect(mock_click.mock.calls[0][1]).toHaveLength(0);
    });
});
