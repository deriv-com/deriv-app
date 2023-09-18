import React from 'react';
import { render } from '@testing-library/react';
import { useStores } from 'Stores';
import Chat from '../chat';

const mock_store: ReturnType<typeof useStores> = {
    order_store: {
        onPageReturn: jest.fn(),
    },
    sendbird_store: {
        is_chat_loading: true,
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

describe('<Chat />', () => {
    it('should remove order id and active order during unmount', () => {
        const { unmount } = render(<Chat />);
        unmount();
        expect(mock_store.order_store.onPageReturn).toHaveBeenCalled();
    });
});
