import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen, waitFor } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/index';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import userEvent from '@testing-library/user-event';
import AnnouncementDialog from '../announcement-dialog';
import { ANNOUNCEMENTS } from '../config';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

const mocked_props = {
    announcement: ANNOUNCEMENTS.ACCUMULATOR_ANNOUNCE.announcement,
    is_announce_dialog_open: true,
    setIsAnnounceDialogOpen: jest.fn(),
    handleOnConfirm: jest.fn(),
    handleOnCancel: jest.fn(),
};

describe('AnnouncementDialog', () => {
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

    it('should trigger the handleOnConfirm() function, when "Try now" button is clicked.', async () => {
        render(<AnnouncementDialog {...mocked_props} />, { wrapper });
        const buttonConfirm = screen.getByRole('button', { name: /Try now/i });
        userEvent.click(buttonConfirm);

        await waitFor(() => {
            expect(mocked_props.handleOnConfirm).toHaveBeenCalled();
        });
    });

    it('should trigger the handleOnCancel() function, when "Learn more" button is clicked.', async () => {
        render(<AnnouncementDialog {...mocked_props} />, { wrapper });
        const buttonCancel = screen.getByRole('button', { name: /Learn more/i });
        userEvent.click(buttonCancel);

        await waitFor(() => {
            expect(mocked_props.handleOnCancel).toHaveBeenCalled();
        });
    });

    it('should trigger the setIsAnnounceDialogOpen() function, when the icon cross button is clicked.', async () => {
        const { container } = render(<AnnouncementDialog {...mocked_props} />, { wrapper });

        // eslint-disable-next-line testing-library/no-node-access, testing-library/no-container
        const close_button = container.querySelector('.dc-dialog__header--close');

        expect(close_button).toBeInTheDocument();

        userEvent.click(close_button);

        await waitFor(() => {
            expect(mocked_props.setIsAnnounceDialogOpen).toHaveBeenCalled();
        });
    });
});
