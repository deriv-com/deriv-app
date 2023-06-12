import React from 'react';
import { isMobile } from '@deriv/shared';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Sidebar from '../sidebar';
import UserGuide from '../user-guide';

const mock_connect_props = {
    dialog_options: {
        title: 'string',
        message: 'string',
        ok_button_text: 'string',
        cancel_button_text: 'string',
    },
    setStrategySaveType: jest.fn(),
};

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect:
        () =>
        <T,>(Component: T) =>
        props =>
            Component({ ...props, ...mock_connect_props }),
}));

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');

    return {
        ...original_module,
        Cards: jest.fn(() => 'Cards'),
        messageWithButton: jest.fn(() => 'messageWithButton'),
        arrayAsMessage: jest.fn(() => 'arrayAsMessage'),
        DesktopWrapper: jest.fn(() => 'DesktopWrapper'),
        MobileWrapper: jest.fn(() => 'MobileWrapper'),
        Text: jest.fn(() => 'Text'),
    };
});

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
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
    setActiveTabTutorial: jest.fn(),
};

describe('<Dashboard />', () => {
    it('should render PopoverComponent if isMobile is false', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        //render(<DashboardComponent {...mocked_props} />);
        //expect(screen.getByText(/Import a bot/i)).toBeInTheDocument();
    });

    it('user guide button click should be enabled', () => {
        render(<UserGuide {...mocked_props} />);
        const use_guide_button = screen.getByTestId('btn-user-guide');
        userEvent.click(use_guide_button);
        expect(screen.getByTestId('btn-user-guide')).toBeInTheDocument();
        expect(use_guide_button).toBeEnabled();
    });

    it('on user guide button click it should render the tutorials tab', () => {
        render(<UserGuide {...mocked_props} />);
        const use_guide_button = screen.getByTestId('btn-user-guide');
        userEvent.click(use_guide_button);
        render(<Sidebar {...mocked_props} />);
        expect(mocked_props.setActiveTab).toHaveBeenCalledWith(3);
    });
});
