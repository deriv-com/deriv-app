import React from 'react';
import { render, screen } from '@testing-library/react';
import MessageList from '../message-list';

describe('MessageList', () => {
    it('Should render the list of messages', () => {
        const list: React.ComponentProps<typeof MessageList>['list'] = [
            { id: '1', message: 'Success message', type: 'success' },
            { id: '2', message: 'Error message', type: 'error' },
            { id: '3', message: 'Info message', type: 'info' },
        ];

        render(<MessageList list={list} />);

        expect(screen.getAllByTestId('dt_alert_message').length).toBe(3);
    });
});
