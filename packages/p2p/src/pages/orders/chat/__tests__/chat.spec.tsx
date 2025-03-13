import React from 'react';
import { render } from '@testing-library/react';
import { useStores } from 'Stores';
import Chat from '../chat';
import { mockStore, StoreProvider } from '@deriv/stores';

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
    const mockStoreData = mockStore({
        client: { prevent_single_login: false },
    });

    it('should remove order id and active order during unmount', () => {
        const { unmount } = render(
            <StoreProvider store={mockStoreData}>
                <Chat />
            </StoreProvider>
        );
        unmount();
        expect(mock_store.order_store.onPageReturn).toHaveBeenCalled();
    });
});
