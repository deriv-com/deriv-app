import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FocusedInput, focusAndOpenKeyboard } from '../focused-input';

describe('FocusedInput', () => {
    it('should apply focus to the passed ReactElement', () => {
        jest.useFakeTimers();

        const MockComponent = () => {
            const input_ref = React.useRef<HTMLInputElement>(null);
            const focused_ref = React.useRef<HTMLInputElement>(null);

            return (
                <React.Fragment>
                    <input type='number' ref={input_ref} />
                    <button onClick={() => focusAndOpenKeyboard(input_ref, focused_ref)}>Focus</button>
                    <FocusedInput focused_ref={focused_ref} />
                </React.Fragment>
            );
        };

        render(<MockComponent />);

        const input = screen.getByRole('spinbutton');
        expect(input).not.toHaveFocus();

        userEvent.click(screen.getByText('Focus'));

        jest.runAllTimers();

        expect(input).toHaveFocus();
    });
});
