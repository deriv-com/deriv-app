import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { Notifications as Announcement } from '@deriv-com/ui';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/index';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

const announcements = [
    {
        icon: 'Icon',
        title: 'Title1',
        message: 'Message1',
        buttonAction: () => jest.fn(),
        actionText: '',
    },
    {
        icon: 'Icon',
        title: 'Title2',
        message: 'Message2',
        buttonAction: () => jest.fn(),
        actionText: '',
    },
];

const mock_component_config = {
    clearButtonText: 'Mark all as read',
    modalTitle: 'Announcement',
    noNotificationsMessage: 'No announcements MESSAGE',
    noNotificationsTitle: 'No announcements',
};

describe('Announcement', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    const mock_store = mockStore({});

    beforeAll(() => {
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render the Announcement component and upon clicking "Mark all as read" button should trigger clearNotificationsCallback() function.', async () => {
        const mockClearNotificationsCallback = jest.fn();
        render(
            <Announcement
                componentConfig={mock_component_config}
                notifications={announcements}
                clearNotificationsCallback={mockClearNotificationsCallback}
                setIsOpen={() => jest.fn()}
                isOpen
            />,
            { wrapper }
        );
        const button = screen.getByRole('button', { name: /Mark all as read/i });
        userEvent.click(button);

        await waitFor(() => {
            expect(mockClearNotificationsCallback).toHaveBeenCalled();
        });
    });
});
