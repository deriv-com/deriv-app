import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DBOT_TABS } from 'Constants/bot-contents';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/index';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import Announcements from '../announcements';
import { BOT_ANNOUNCEMENTS_LIST } from '../config';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/xml/main.xml', () => '<xml>sample</xml>');
window.Blockly = {
    utils: {
        xml: {
            textToDom: (xmlString: string) => {
                const parser = new DOMParser();
                return parser.parseFromString(xmlString, 'text/xml');
            },
        },
    },
    Xml: { domToText: () => ({}) },
};

const mockHandleTabChange = jest.fn();

describe('Announcements', () => {
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

    it('should decrease the indicator count, the list of announcements should be displayed, and redirect to tutorial page upon clicking on the accumulator announcement item.', async () => {
        const { container } = render(<Announcements handleTabChange={mockHandleTabChange} is_mobile={true} />, {
            wrapper,
        });
        const button = screen.getByTestId('btn-announcements');
        userEvent.click(button);

        await waitFor(() => {
            // eslint-disable-next-line testing-library/no-node-access, testing-library/no-container
            const notification_button = container.querySelectorAll('.notification__button')[2];

            expect(notification_button).toBeInTheDocument();

            userEvent.click(notification_button);
        });
        await waitFor(() => {
            const amount = screen.getByTestId('announcements__amount').textContent;
            expect(amount).toBe(`${BOT_ANNOUNCEMENTS_LIST.length - 1}`);

            const button_cancel = screen.getByRole('button', { name: /Learn more/i });
            userEvent.click(button_cancel);
        });
        await waitFor(() => {
            expect(mock_DBot_store?.dashboard.setActiveTab(DBOT_TABS.TUTORIAL));
        });
    });

    it('should decrease the indicator count, the list of announcements should be displayed, and redirect to bot builder page upon clicking on the accumulator announcement item.', async () => {
        const { container } = render(<Announcements handleTabChange={mockHandleTabChange} is_mobile={true} />, {
            wrapper,
        });
        const button = screen.getByTestId('btn-announcements');
        userEvent.click(button);

        await waitFor(() => {
            // eslint-disable-next-line testing-library/no-node-access, testing-library/no-container
            const notification_button = container.querySelectorAll('.notification__button')[2];

            expect(notification_button).toBeInTheDocument();

            userEvent.click(notification_button);
        });
        await waitFor(() => {
            const amount = screen.getByTestId('announcements__amount').textContent;
            expect(amount).toBe(`${BOT_ANNOUNCEMENTS_LIST.length - 1}`);

            const buttonConfirm = screen.getByRole('button', { name: /Try now/i });
            userEvent.click(buttonConfirm);
        });
        await waitFor(() => {
            expect(mock_DBot_store?.dashboard.setActiveTab(DBOT_TABS.BOT_BUILDER));
        });
    });

    it('should disappear the announcements indicator, when the "Mark All as Read" button is clicked.', async () => {
        render(<Announcements handleTabChange={mockHandleTabChange} is_mobile={false} />, {
            wrapper,
        });

        const button_announcements = screen.getByTestId('btn-announcements');
        userEvent.click(button_announcements);

        const button_mark_all_as_read = screen.getByRole('button', { name: /Mark all as read/i });
        userEvent.click(button_mark_all_as_read);

        await waitFor(() => {
            expect(screen.queryByTestId('announcements__amount')).not.toBeInTheDocument();
        });
    });

    it('should display all active announcements when bot-announcements has already existed in local storage.', () => {
        localStorage?.setItem('bot-announcements', JSON.stringify({ ...BOT_ANNOUNCEMENTS_LIST }));
        render(<Announcements handleTabChange={mockHandleTabChange} is_mobile={false} />, {
            wrapper,
        });

        const button = screen.getByTestId('btn-announcements');
        userEvent.click(button);

        expect(screen.getByTestId('announcements__amount')).toHaveTextContent(`${BOT_ANNOUNCEMENTS_LIST.length}`);
    });
});
