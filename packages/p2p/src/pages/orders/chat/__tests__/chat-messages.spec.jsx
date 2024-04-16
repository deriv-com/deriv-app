import React from 'react';
import { render, screen } from '@testing-library/react';
import ChatMessage from 'Utils/chat-message';
import ChatMessages from '../chat-messages';

const mock_use_store_values = {
    sendbird_store: {
        active_chat_channel: {},
        chat_info: {
            user_id: 'test_user_id',
        },
        chat_messages: [
            new ChatMessage({
                created_at: 3,
                channel_url: 'test',
                file_type: '',
                id: 1,
                message: 'test',
                message_type: 'user',
                name: 'test',
                sender_user_id: 'test',
                url: 'test',
                status: 2,
                custom_type: '',
            }),
        ],
        onMessagesScroll: jest.fn(),
        setMessagesRef: jest.fn(),
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_use_store_values),
}));

describe('<ChatMessages />', () => {
    it('should render the bot message with appropriate styles', () => {
        render(<ChatMessages />);
        const bot_message = screen.getByText(
            /Hello! This is where you can chat with the counterparty to confirm the order details./
        );
        const bot_message2 = screen.getByText(/Note: In case of a dispute, we'll use this chat as a reference./);
        expect(bot_message).toBeInTheDocument();
        expect(bot_message2).toBeInTheDocument();
        expect(bot_message).toHaveStyle('--text-lh: var(--text-lh-xl)');
        expect(bot_message).toHaveStyle('--text-size: var(--text-size-xxs)');
    });
});
