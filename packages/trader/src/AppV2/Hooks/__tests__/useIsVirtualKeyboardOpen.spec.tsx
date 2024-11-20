import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useIsVirtualKeyboardOpen from '../useIsVirtualKeyboardOpen';

describe('useIsVirtualKeyboardOpen', () => {
    it('returns false if the field received focus, but the resize event was not triggered', async () => {
        render(<input type='number' />);
        const { result } = renderHook(() => useIsVirtualKeyboardOpen('test'));

        const input = screen.getByRole('spinbutton');
        expect(input).not.toHaveFocus();

        await userEvent.click(input);
        expect(input).toHaveFocus();

        const { is_key_board_visible } = result.current;
        expect(is_key_board_visible).toBeFalsy;
    });
});
