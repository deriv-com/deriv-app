import React from 'react';
import { useStore } from '@deriv/stores';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen, act, waitFor } from '@testing-library/react';
import BotBuilder from '..';
import { mockStore, StoreProvider } from '@deriv/stores';
import { DBotStoreProvider, mockDBotStore, useDBotStore } from 'Stores/useDBotStore';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
    terminateBot: jest.fn(),
    terminateConnection: jest.fn(),
    initWorkspace: jest.fn().mockResolvedValue({abc: 123}),
}));

jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());
jest.mock('../../dbot-tours/bot-builder-tour', () => jest.fn(() => <div>BotBuilderTourHandler</div>));
jest.mock('../../../quick-strategy', () => jest.fn(() => <div>QuickStrategy1</div>));
jest.mock('../workspace-wrapper', () => jest.fn((props) => {
    // console.log('props', props);
    
    return (<>WorkspaceWrapper</>)
}));
// jest.mock('../../../bot-snackbar', () => jest.fn(({ handleClose }) => <div onClick={() => handleClose()}>BotSnackbar</div>))
// }))

// jest.mock('../../../bot-snackbar', () => ({
//     ...jest.requireActual('../../../bot-snackbar'),
//     BotSnackbar:jest.fn(({ handleClose, children }) => <div>{children }</div>),
// }));

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
        getAllFields: jest.fn(() => ([])),
        removeChangeListener: jest.fn(),
        dispose: jest.fn(),
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

    it('should render BotBuilder', () => {
        act(() => {
            mock_DBot_store?.blockly_store?.setLoading(false);
            mock_DBot_store?.flyout.setVisibility(true);
        });
       
        render(<BotBuilder />, { wrapper });

        expect(screen.getByTestId('bot-builder-container')).toBeInTheDocument();
    });
    it('should render BotBuilder with BotBuilderTourHandler when active_tab equals 1', () => {
        act(() => {
            mock_DBot_store?.dashboard?.setActiveTab(1);
        });
            
        render(<BotBuilder />, { wrapper });
        
        expect(screen.getByText('BotBuilderTourHandler')).toBeInTheDocument();
    });

    it('should render BotBuilder with QuickStrategy1 when is_open equals true', () => {
        act(() => {
            mock_DBot_store?.quick_strategy?.setFormVisibility(true);
        });
        
        render(<BotBuilder />, { wrapper });
        
        expect(screen.getByText('QuickStrategy1')).toBeInTheDocument();
    });

    it('should not render BotBuilder with WorkspaceWrapper when is_preview_on_popup true', async() => {
        render(<BotBuilder />, { wrapper });
        mock_DBot_store?.dashboard?.setPreviewOnPopup(true);
        // screen.debug()
        expect(screen.getByTestId('bot-builder-container')).toBeInTheDocument();
    });

    it('should handle handleBlockChangeOnBotRun() and removeBlockChangeListener() when  is_blockly_listener_registered.current exist', () => {
        const id_ref = React.createRef<HTMLDivElement>();
        const { container } = render(<BotBuilder />, { wrapper });
        // screen.debug()
        expect(container).toBeInTheDocument();
    });
});
