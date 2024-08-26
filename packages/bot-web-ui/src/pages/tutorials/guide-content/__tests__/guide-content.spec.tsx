import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import GuideContent from '..';
import userEvent from '@testing-library/user-event';
import { DBOT_TABS } from 'Constants/bot-contents';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

const mock_guide_tab_content = [
    {
        id: 1,
        type: 'Tour',
        subtype: 'OnBoard',
        content: 'Get started on Deriv Bot',
        src: 'dbot-onboard-tour.png',
        search_id: 'ugc-0',
    },
    {
        id: 2,
        type: 'Tour',
        subtype: 'BotBuilder',
        content: 'Let’s build a bot!',
        src: 'bot-builder-tour.png',
        search_id: 'ugc-1',
    },
];

const mock_video_tab_content = [
    {
        id: 1,
        type: 'DBotVideo',
        content: 'An introduction to Deriv Bot',
        url: 'https://www.youtube.com/embed/lthEgaIY1uw',
        src: 'intro_to_deriv_bot.png',
    },
];

const mocked_props = {
    guide_tab_content: mock_guide_tab_content,
    video_tab_content: mock_video_tab_content,
    is_dialog_open: true,
};

describe('<GuideContent />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element;
    const mock_store = mockStore({
        ui: {
            is_mobile: true,
        },
    });
    const mock_DBot_store = mockDBotStore(mock_store, mock_ws);

    beforeAll(() => {
        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render the GuideContent component', () => {
        render(<GuideContent {...mocked_props} />, { wrapper });

        expect(screen.getByText('Step-by-step guides')).toBeInTheDocument();
        expect(screen.getByText('Videos on Deriv Bot')).toBeInTheDocument();
    });

    it('should not define the active tour with function the setActiveTour() when it is the desktop version.', async () => {
        mock_store.ui.is_desktop = true;
        render(<GuideContent {...mocked_props} />, {
            wrapper,
        });

        await waitFor(() => {
            expect(mock_DBot_store.dashboard.active_tour).toBe('');
        });
    });

    it('should open the dialog upon clicking the tutorial video button.', async () => {
        mock_store.ui.is_desktop = false;
        const { container } = render(<GuideContent {...mocked_props} />, {
            wrapper,
        });

        // eslint-disable-next-line testing-library/no-node-access, testing-library/no-container
        const tutorial_video_button = container.querySelector('.tutorials-wrap__placeholder__button-group--play');
        userEvent.click(tutorial_video_button);

        await waitFor(() => {
            expect(mock_DBot_store?.dashboard.is_dialog_open).toBeTruthy();
        });
    });

    it('should open the tab dashboard upon clicking tutorial card button.', async () => {
        mock_store.ui.is_desktop = false;
        render(<GuideContent {...mocked_props} />, {
            wrapper,
        });

        const tutorial_card_button = screen.getAllByTestId('tutorials-wrap--tour')[0];
        userEvent.click(tutorial_card_button);

        await waitFor(() => {
            expect(mock_DBot_store?.dashboard.setActiveTab(DBOT_TABS.DASHBOARD));
        });
    });

    it('should trigger the keyDown event upon clicking "Enter"', async () => {
        const mockEventListener = jest.fn();
        render(<GuideContent {...mocked_props} />, {
            wrapper,
        });

        document.addEventListener('keydown', mockEventListener);
        const button_cancel = screen.getAllByTestId('tutorials-wrap--tour')[1];
        // use fireEvent since userEvent doesn't handle the case: userEvent.type(button_cancel, '{Enter}');
        fireEvent.keyDown(button_cancel, { key: 'Enter', code: 'Enter', keyCode: 13 });

        await waitFor(() => {
            expect(mockEventListener).toHaveBeenCalledWith(expect.objectContaining({ key: 'Enter', code: 'Enter' }));
        });
    });

    it('should set active tab of bot builder when subtype is a "BotBuilder" and trigger tour button was clicked.', async () => {
        render(<GuideContent {...mocked_props} />, {
            wrapper,
        });
        const button_trigger_tour = screen.getAllByTestId('tutorials-wrap--tour')[1];
        userEvent.click(button_trigger_tour);
        await waitFor(() => {
            expect(mock_DBot_store?.dashboard.setActiveTab(DBOT_TABS.BOT_BUILDER));
        });
    });

    it('should render the video content when the guide tab content length equals 0', async () => {
        render(<GuideContent {...mocked_props} guide_tab_content={[]} />, {
            wrapper,
        });

        await waitFor(() => {
            expect(screen.getByText(/Videos on Deriv Bot/i));
        });
    });
});
