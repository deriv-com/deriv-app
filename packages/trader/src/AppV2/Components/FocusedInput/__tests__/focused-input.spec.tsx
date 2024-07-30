import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FocusedInput from '../focused-input';

describe('FocusedInput', () => {
    it('should apply focus to the passed ReactElement', () => {
        jest.useFakeTimers();

        const MockComponent = () => {
            const [is_focused, setIsFocused] = React.useState(false);
            const input_ref = React.useRef<HTMLInputElement>(null);

            return (
                <React.Fragment>
                    <input type='number' ref={input_ref} />
                    <button onClick={() => setIsFocused(true)}>Focus</button>
                    <FocusedInput focused_ref={input_ref} is_visible={is_focused} setIsFocused={setIsFocused} />
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
