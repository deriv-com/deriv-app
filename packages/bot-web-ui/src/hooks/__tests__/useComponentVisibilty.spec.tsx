import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { useComponentVisibility } from '../useComponentVisibility';

describe('useComponentVisibility', () => {
    const ref = { current: document.createElement('input') };
    const Component = () => {
        const { is_dropdown_visible, setDropdownVisibility } = useComponentVisibility(ref);

        return (
            <div>
                <div data-testid='dropdown-status'>{is_dropdown_visible ? 'visible' : 'hidden'}</div>
                <button onClick={() => setDropdownVisibility(!is_dropdown_visible)}>Toggle Dropdown</button>
            </div>
        );
    };

    it('should render dropdown visibility to be hidden on ESC key press', () => {
        render(<Component />);
        const dropdownStatus = screen.getByTestId('dropdown-status');
        const toggleButton = screen.getByText('Toggle Dropdown');

        expect(dropdownStatus).toHaveTextContent('hidden');

        fireEvent.click(toggleButton);
        expect(dropdownStatus).toHaveTextContent('visible');

        fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
        expect(dropdownStatus).toHaveTextContent('hidden');
    });

    it('should render dropdown visibility to be hidden on outside click', () => {
        render(<Component />);
        const dropdownStatus = screen.getByTestId('dropdown-status');
        const toggleButton = screen.getByText('Toggle Dropdown');

        expect(dropdownStatus).toHaveTextContent('hidden');

        fireEvent.click(toggleButton);
        expect(dropdownStatus).toHaveTextContent('visible');

        fireEvent.click(document.body);
        expect(dropdownStatus).toHaveTextContent('hidden');
    });
});
