import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { POILimited } from '../limited';

describe('<POILimited/>', () => {
    it('should render POILimited component', () => {
        window.LC_API = {
            open_chat_window: jest.fn(),
        };
        render(<POILimited />);
        expect(screen.getByText(/you've reached the limit for uploading your documents\./i)).toBeInTheDocument();
        expect(screen.getByText(/please contact us via/i)).toBeInTheDocument();

        const live_chat_text = screen.getByText(/live chat/i);
        expect(live_chat_text).toBeInTheDocument();
        fireEvent.click(live_chat_text);
        expect(window.LC_API.open_chat_window).toHaveBeenCalledTimes(1);
    });
});
