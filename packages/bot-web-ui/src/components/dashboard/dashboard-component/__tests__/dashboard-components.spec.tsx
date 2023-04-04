import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserGuide from '../user-guide';
import Sidebar from 'Components/dashboard/tutorial-tab/sidebar';

//arrange
jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect:
        () =>
        <T,>(Component: T) =>
            Component,
}));

jest.mock('@deriv/bot-skeleton', () => ({
    Blockly: jest.fn(),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Tabs: jest.fn(() => true),
    performSelfExclusionCheck: jest.fn(),
}));

export const mocked_props = {
    active_tab: '3',
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
    setHasTourEnded: jest.fn(),
    setOnBoardTourRunState: jest.fn(),
    setTourActiv: jest.fn(),
    setTourDialogVisibility: jest.fn(),
    showVideoDialog: jest.fn(),
    performSelfExclusionCheck: jest.fn(),
};
//arrange

describe('<Dashboard />', () => {
    beforeEach(() => mocked_props);
    it('user guide button click', () => {
        // arrange
        render(<UserGuide {...mocked_props} />);
        const use_guide_button = screen.getByTestId('btn-use-guide');
        //act
        userEvent.click(use_guide_button);
    });

    it('on user guide button click it should render the tutorials tab', () => {
        // arrange
        render(<UserGuide {...mocked_props} />);
        const use_guide_button = screen.getByTestId('btn-use-guide');
        //act
        userEvent.click(use_guide_button);
        render(<Sidebar {...mocked_props} />);
        // assert
        expect(screen.getByRole('textbox')).toHaveClass('dc-tabs__wrapper__group__search-input', { exact: true });
    });
});
