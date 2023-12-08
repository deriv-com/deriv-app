import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import GuideContent from '..';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

export const mock_user_guide_content = [
    {
        id: 1,
        type: 'Tour',
        subtype: 'OnBoard',
        content: 'Get started on Deriv Bot',
        src: 'dbot-onboard-tour.png',
        tab_id: 0,
        search_id: 'ugc-0',
    },
    {
        id: 2,
        type: 'Tour',
        subtype: 'BotBuilder',
        content: 'Let’s build a bot!',
        src: 'bot-builder-tour.png',
        tab_id: 0,
        search_id: 'ugc-1',
    },
];

export const mock_guide_content = [
    {
        id: 1,
        type: 'DBotVideo',
        content: 'Deriv Bot - your automated trading partner',
        url: 'https://www.youtube.com/embed/QdI5zCkO4Gk',
        src: 'video_dbot.webp',
        tab_id: 0,
        search_id: 'gc-0',
    },
];

const guide_list = [
    {
        id: 1,
        content: 'Guide 1',
        type: 'Tour',
        subtype: 'OnBoard',
        src: 'tour_image_url_1',
    },
    {
        id: 2,
        content: 'Guide 2',
        type: 'Tour',
        subtype: 'Other',
        src: 'tour_image_url_2',
    },
    {
        id: 3,
        content: 'Video 1',
        type: 'Video',
        url: 'video_url_1',
        src: 'video_image_url_1',
    },
];

describe('<FAQContent />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element;
    const mock_store = mockStore({
        ui: {
            is_mobile: true,
        },
    });
    const mock_DBot_store = mockDBotStore(mock_store, mock_ws);

    beforeEach(() => {
        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
        render(<GuideContent guide_tab_content={mock_user_guide_content} video_tab_content={mock_guide_content} />, {
            wrapper,
        });
    });

    it('should render the component', () => {
        expect(screen.getByText('Step-by-step guides')).toBeInTheDocument();
        expect(screen.getByText('Videos on Deriv Bot')).toBeInTheDocument();
    });
});
