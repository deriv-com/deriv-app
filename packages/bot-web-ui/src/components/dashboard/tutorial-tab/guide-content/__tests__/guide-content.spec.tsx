import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import GuideContent from '..';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

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
        render(<GuideContent guide_list={guide_list} />, {
            wrapper,
        });
    });

    it('should render the component', () => {
        expect(screen.getByText('Step-by-step guides')).toBeInTheDocument();
        expect(screen.getByText('Videos on Deriv Bot')).toBeInTheDocument();
    });
});
