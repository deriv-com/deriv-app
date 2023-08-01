import React from 'react';
import { render, screen } from '@testing-library/react';
import AnimatedMessageList from '../animated-message-list';

describe('MessageList', () => {
    it('Should render the list of messages', () => {
        const list: React.ComponentProps<typeof AnimatedMessageList>['list'] = [
            { id: '1', message: 'Success message' },
            { id: '2', message: 'Error message' },
            { id: '3', message: 'Info message' },
        ];

        render(
            <AnimatedMessageList list={list} Element={({ message }: { message: string }) => <div>{message}</div>} />
        );

        expect(screen.getAllByTestId('dt_list_item')).toHaveLength(3);
    });
});
