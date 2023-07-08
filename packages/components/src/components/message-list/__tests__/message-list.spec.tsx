import React from 'react';
import { render, screen } from '@testing-library/react';
import MessageList from '../message-list';

describe('MessageList', () => {
    it('Should render the list of messages', () => {
        const list: React.ComponentProps<typeof MessageList>['list'] = [
            { variant: 'base', id: '1', message: 'Success message', type: 'success' },
            { variant: 'base', id: '2', message: 'Error message', type: 'error' },
            { variant: 'base', id: '3', message: 'Info message', type: 'info' },
        ];

        render(<MessageList list={list} />);

        expect(screen.getAllByTestId('dt_alert_message').length).toBe(3);
    });
});
