import React from 'react';
import { configure } from 'mobx';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import HelpBase from '../flyout-help-base';

configure({ safeDescriptors: false });

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

const mock_help_content_config = {
    trade_definition: [
        {
            type: 'text',
        },
        {
            type: 'text',
        },
        {
            type: 'block',
        },
    ],
    variables_set: [
        {
            type: 'text',
        },
        {
            type: 'block',
        },
        {
            type: 'image',
            url: '/media/create_variable.jpg',
        },
    ],
    controls_for: [
        {
            type: 'text',
        },
        {
            type: 'block',
        },
        {
            type: 'video',
            url: '/media/set_variable.mp4',
        },
    ],
    trade_again: [
        {
            type: 'text',
        },
        {
            type: 'example',
            example_id: 'test_example_id',
        },
    ],
    sample: [{}],
};

const mock_example = [
    {
        id: 'test_example_id',
        childNodes: [{}],
    },
];

jest.mock('../../../../utils/help-content/help-content.config', () => ({
    ...jest.requireActual('../../../../utils/help-content/help-content.config'),
    help_content_config: () => mock_help_content_config,
}));

const mockAddBlockNode = jest.fn();
window.Blockly = {
    inject: () => ({
        isFlyout: true,
    }),
    Xml: {
        domToBlock: () => ({
            getHeightWidth: () => '200px',
            isInFlyout: true,
            moveBy: () => ({}),
            getSvgRoot: () => ({}),
        }),
    },
    bindEventWithChecks_: () => ({}),
    bindEvent_: () => ({}),
    svgResize: () => ({}),
    derivWorkspace: { addBlockNode: mockAddBlockNode },
};

const mock_help_string = {
    text: [
        "This block is mandatory. It's added to your strategy by default when you create new strategy. You can not add more than one copy of this block to the canvas.",
    ],
    image: '/media/create_variable.jpg',
    video: '/media/set_variable.mp4',
    example: 'trade_again',
};

describe('<HelpBase />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;

    beforeEach(() => {
        const mock_store = mockStore({});
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render the HelpBase component', () => {
        const { container } = render(<HelpBase />, { wrapper });
        expect(container).toBeInTheDocument();
    });

    it('should render the previous button', () => {
        if (mock_DBot_store) {
            mock_DBot_store.flyout_help.should_previous_disable = true;
        }

        render(<HelpBase />, { wrapper });

        const previous = screen.getByText('Previous');
        expect(previous).toBeInTheDocument();
        expect(previous).toHaveStyle('--text-size: var(--text-size-xs);');
    });

    it('should render the next button', () => {
        if (mock_DBot_store) {
            mock_DBot_store.flyout_help.should_next_disable = true;
        }

        render(<HelpBase />, { wrapper });

        const next = screen.getByText('Next');
        expect(next).toBeInTheDocument();
        expect(next).toHaveStyle('--text-size: var(--text-size-xs);');
    });

    it('should render Text type content', () => {
        if (mock_DBot_store) {
            mock_DBot_store.flyout_help.help_string = mock_help_string;
            mock_DBot_store.flyout_help.block_type = 'trade_definition';
        }

        render(<HelpBase />, { wrapper });
        expect(screen.getByText(mock_help_string.text[0])).toBeInTheDocument();
    });

    it('should render Image type content', () => {
        if (mock_DBot_store) {
            mock_DBot_store.flyout_help.help_string = mock_help_string;
            mock_DBot_store.flyout_help.block_type = 'variables_set';
        }

        render(<HelpBase />, { wrapper });

        const add = screen.getByText('Add');
        userEvent.click(add);
        expect(mockAddBlockNode).toBeCalled();
        expect(screen.getByRole('img')).toHaveAttribute('src', mock_help_string.image);
    });

    it('should render Video type content', () => {
        if (mock_DBot_store) {
            mock_DBot_store.flyout_help.help_string = mock_help_string;
            mock_DBot_store.flyout_help.block_type = 'controls_for';
        }

        render(<HelpBase />, { wrapper });
        expect(screen.getByTestId('dt_flyout_video_container')).toBeInTheDocument();
    });

    it('should render Example type content', () => {
        if (mock_DBot_store) {
            mock_DBot_store.flyout_help.help_string = mock_help_string;
            mock_DBot_store.flyout_help.block_type = 'trade_again';
            mock_DBot_store.flyout_help.examples = mock_example;
        }

        render(<HelpBase />, { wrapper });
        expect(screen.getByTestId('flyout-block-workspace')).toBeInTheDocument();
    });

    it('should render null if no example type content', () => {
        if (mock_DBot_store) {
            mock_DBot_store.flyout_help.help_string = mock_help_string;
            mock_DBot_store.flyout_help.block_type = 'trade_again';
            mock_DBot_store.flyout_help.examples = [];
        }

        render(<HelpBase />, { wrapper });
        expect(screen.queryByTestId('flyout-block-workspace')).not.toBeInTheDocument();
    });

    it('should render null if no type is available ', () => {
        if (mock_DBot_store) {
            mock_DBot_store.flyout_help.block_type = 'sample';
        }

        render(<HelpBase />, { wrapper });
        expect(screen.queryByTestId('flyout-block-workspace')).not.toBeInTheDocument();
    });

    it('should render onSequenceClick to be called on the next button', () => {
        const mockOnSequenceClick = jest.fn();
        if (mock_DBot_store) {
            mock_DBot_store.flyout_help.help_string = mock_help_string;
            mock_DBot_store.flyout_help.block_type = 'trade_definition';
            mock_DBot_store.flyout_help.onSequenceClick = mockOnSequenceClick;
        }

        render(<HelpBase />, { wrapper });

        const next = screen.getByText('Next');
        userEvent.click(next);
        expect(mockOnSequenceClick).toBeCalled();
    });

    it('should render onSequenceClick to be called on the previous button', () => {
        const mockOnSequenceClick = jest.fn();
        if (mock_DBot_store) {
            mock_DBot_store.flyout_help.help_string = mock_help_string;
            mock_DBot_store.flyout_help.block_type = 'trade_definition';
            mock_DBot_store.flyout_help.onSequenceClick = mockOnSequenceClick;
        }

        render(<HelpBase />, { wrapper });

        const previous = screen.getByText('Previous');
        userEvent.click(previous);
        expect(mockOnSequenceClick).toBeCalled();
    });
});
