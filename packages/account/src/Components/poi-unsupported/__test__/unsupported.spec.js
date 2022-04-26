import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Unsupported from '../unsupported';

it('should trigger onClick callback when the client clicks the "LiveChat" link', () => {
    window.LC_API = {
        open_chat_window: jest.fn(),
    };
    render(<Unsupported />);
    fireEvent.click(screen.getByText('LiveChat'));
    expect(window.LC_API.open_chat_window).toHaveBeenCalledTimes(1);
});
