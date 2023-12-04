import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen } from '@testing-library/react';
import BotBuilder from '..';
import { useDBotStore } from 'Stores/useDBotStore';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
    terminateBot: jest.fn(),
    terminateConnection: jest.fn(),
    initWorkspace: jest.fn().mockResolvedValue({ key: 0 }),
}));

jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());
jest.mock('../../dbot-tours/bot-builder-tour', () => jest.fn(() => <div>BotBuilderTourHandler</div>));
jest.mock('../../../quick-strategy', () => jest.fn(() => <div>QuickStrategy1</div>));
jest.mock('../workspace-wrapper', () => jest.fn(() => <div>WorkspaceWrapper</div>));
jest.mock('../../dashboard-component/load-bot-preview/save-modal', () => jest.fn(() => <div>SaveModal</div>));
jest.mock('../../../load-modal', () => jest.fn(() => <div>LoadModal</div>));
jest.mock('../../../bot-snackbar', () =>
    jest.fn(({ handleClose }) => <div onClick={() => handleClose()}>BotSnackbar</div>)
);

const mockDBot = {
    dashboard: {
        is_preview_on_popup: false,
        active_tab: 0,
        active_tour: false,
    },
    quick_strategy: {
        is_open: true,
    },
    run_panel: {
        is_running: true,
    },
    app: {
        onMount: jest.fn(),
        onUnmount: jest.fn(),
    },
};

jest.mock('../../../../stores/useDBotStore', () => ({
    useDBotStore: jest.fn(() => mockDBot),
}));

const mockTextToDom = jest.fn(() => {
    const xml_element = document.createElement('xml');
    return xml_element;
});

window.Blockly = {
    Xml: {
        textToDom: mockTextToDom,
    },
    derivWorkspace: {
        options: {},
        getGesture: jest.fn(),
        getVariableMap: jest.fn(),
        getAllFields: jest.fn(() => []),
        removeChangeListener: jest.fn(),
        dispose: jest.fn(),
        addChangeListener: jest.fn(),
    },
    VerticalFlyout: jest.fn(() => ({
        workspace_: {
            createPotentialVariableMap: jest.fn(),
        },
    })),
    svgResize: () => ({}),
};

Object.defineProperty(window, 'performance', {
    value: {
        clearMeasures: jest.fn(),
    },
});

describe('BotBuilder component', () => {
    it('should render BotBuilder', () => {
        (useDBotStore as jest.Mock).mockReturnValueOnce({
            ...mockDBot,
            dashboard: {
                is_preview_on_popup: true,
            },
        });

        render(<BotBuilder />);

        expect(screen.getByTestId('bot-builder-container')).toBeInTheDocument();
    });

    it('should render BotBuilder with BotBuilderTourHandler when active_tab equals 1', () => {
        (useDBotStore as jest.Mock).mockReturnValueOnce({
            ...mockDBot,
            dashboard: {
                active_tab: 1,
            },
        });

        render(<BotBuilder />);

        expect(screen.getByText('BotBuilderTourHandler')).toBeInTheDocument();
    });

    it('should render BotBuilder with QuickStrategy1 when is_open equals true', () => {
        (useDBotStore as jest.Mock).mockReturnValueOnce({
            ...mockDBot,
            quick_strategy: {
                is_open: true,
            },
        });

        render(<BotBuilder />);

        expect(screen.getByText('QuickStrategy1')).toBeInTheDocument();
    });

    it('should not render BotBuilder with WorkspaceWrapper when is_preview_on_popup true', async () => {
        (useDBotStore as jest.Mock).mockReturnValueOnce({
            ...mockDBot,
            dashboard: {
                is_preview_on_popup: true,
            },
        });
        render(<BotBuilder />);
        expect(screen.queryByTestId('preview-container')).not.toBeInTheDocument();
    });
});
