import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
// eslint-disable-next-line import/no-extraneous-dependencies
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/index';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import UserGuide from '../user-guide';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
}));

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());
jest.mock('@deriv/deriv-charts', () => ({
    setSmartChartsPublicPath: jest.fn(),
}));

export const mocked_props = {
    active_tab: '3',
    is_tour_dialog_visible: true,
    dialog_options: {
        title: 'string',
        message: 'string',
        ok_button_text: 'string',
        cancel_button_text: 'string',
    },
    Blockly: jest.fn(),
    faq_search_value: '',
    guide_list: [],
    is_dialog_open: true,
    onOkButtonClick: jest.fn(),
    setActiveTab: jest.fn(() => 3),
    setOnBoardTourRunState: jest.fn(),
    setTourActiv: jest.fn(),
    setTourDialogVisibility: jest.fn(),
    showVideoDialog: jest.fn(),
    performSelfExclusionCheck: jest.fn(),
    setActiveTabTutorial: jest.fn(),
};

describe('<Dashboard />', () => {
    it('user guide button click should be enabled', () => {
        const mock_store = mockStore({});
        const mock_DBot_store = mockDBotStore(mock_store, mock_ws);
        render(
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    <UserGuide {...mocked_props} />
                    <div>hi</div>
                </DBotStoreProvider>
            </StoreProvider>
        );
        const use_guide_button = screen.getByTestId('btn-user-guide');
        userEvent.click(use_guide_button);
        expect(screen.getByTestId('btn-user-guide')).toBeInTheDocument();
        expect(use_guide_button).toBeEnabled();
    });
});
