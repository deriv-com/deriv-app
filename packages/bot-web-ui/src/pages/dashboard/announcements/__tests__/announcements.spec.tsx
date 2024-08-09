import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen, waitFor } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/index';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import Announcements from '../announcements';
import userEvent from '@testing-library/user-event';
import { DBOT_TABS } from 'Constants/bot-contents';

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

    it('the list of announcements should be displayed, and clicking on the third one should decrease the indicator count and remove it, and redirect to tutorial page.', async () => {
        const { container } = render(<Announcements handleTabChange={mockHandleTabChange} is_mobile={true} />, {
            wrapper,
        });
        const button = screen.getByTestId('btn-announcements');
        userEvent.click(button);

        await waitFor(() => {
            // eslint-disable-next-line testing-library/no-node-access, testing-library/no-container
            const notification_button = container.querySelector('.notification__button');

            expect(notification_button).toBeInTheDocument();

            if (notification_button) {
                userEvent.click(notification_button);
            }
        })
            .then(() => {
                expect(screen.queryByTestId('announcements__amount')).not.toBeInTheDocument();

                const button_cancel = screen.getByRole('button', { name: /Learn more/i });
                userEvent.click(button_cancel);
            })
            .then(() => {
                expect(mock_DBot_store?.dashboard.setActiveTab(DBOT_TABS.TUTORIAL));
            });
    });

    it('the list of announcements should be displayed, and clicking on the third one should decrease the indicator count and remove it, and redirect to bot builder page.', async () => {
        const { container } = render(<Announcements handleTabChange={mockHandleTabChange} is_mobile={true} />, {
            wrapper,
        });
        const button = screen.getByTestId('btn-announcements');
        userEvent.click(button);

        await waitFor(() => {
            // eslint-disable-next-line testing-library/no-node-access, testing-library/no-container
            const notification_button = container.querySelector('.notification__button');

            expect(notification_button).toBeInTheDocument();

            if (notification_button) {
                userEvent.click(notification_button);
            }
        })
            .then(() => {
                expect(screen.queryByTestId('announcements__amount')).not.toBeInTheDocument();
                const buttonConfirm = screen.getByRole('button', { name: /Try now/i });
                userEvent.click(buttonConfirm);
            })
            .then(() => {
                expect(mock_DBot_store?.dashboard.setActiveTab(DBOT_TABS.BOT_BUILDER));
            });
    });

    it('when the "Mark All as Read" button is clicked, the announcements indicator should disappear.', async () => {
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

    it('the announcements should display all active announcements when bot-announcements has already existed in local storage.', () => {
        localStorage?.setItem(
            'bot-announcements',
            JSON.stringify({ announce_1: true, announce_2: true, announce_3: true })
        );
        render(<Announcements handleTabChange={mockHandleTabChange} is_mobile={false} />, {
            wrapper,
        });

        const button = screen.getByTestId('btn-announcements');
        userEvent.click(button);

        expect(screen.getByTestId('announcements__amount')).toHaveTextContent('3');
    });
});
