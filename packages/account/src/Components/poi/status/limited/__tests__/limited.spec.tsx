import React from 'react';

import { Chat } from '@deriv/utils';
import { fireEvent, render, screen } from '@testing-library/react';

import { POILimited } from '../limited';

describe('<POILimited/>', () => {
    beforeEach(() => {
        jest.spyOn(Chat, 'open').mockImplementation(jest.fn());
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should render POILimited component', () => {
        render(<POILimited />);
        expect(screen.getByText(/you've reached the limit for uploading your documents\./i)).toBeInTheDocument();
        expect(screen.getByText(/please contact us via/i)).toBeInTheDocument();

        const live_chat_text = screen.getByText(/live chat/i);
        expect(live_chat_text).toBeInTheDocument();
        fireEvent.click(live_chat_text);
        expect(Chat.open).toHaveBeenCalledTimes(1);
    });
});
