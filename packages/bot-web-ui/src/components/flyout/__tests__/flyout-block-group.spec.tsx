import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import FlyoutBlockGroup from '../flyout-block-group';

jest.mock('@deriv/bot-skeleton/src/scratch/xml/main.xml', () => '<xml>sample</xml>');
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

const mockDomToBlock = jest.fn(() => ({
    getHeightWidth: jest.fn(() => ({ height: 100, width: 100 })),
    moveBy: jest.fn(),
    getSvgRoot: jest.fn(),
}));

const mockBlockMeta = {
    display_name: 'display_name',
    description: 'block_description',
};

const mockAddBlockNode = jest.fn();

window.Blockly = {
    Blocks: {
        variables_get: {
            meta: () => mockBlockMeta,
        },
        variables_set: {
            meta: () => mockBlockMeta,
        },
    },
    inject: () => ({}),
    Xml: {
        domToBlock: mockDomToBlock,
    },
    derivWorkspace: {
        addBlockNode: mockAddBlockNode,
    },
    bindEventWithChecks_: jest.fn(),
    bindEvent_: jest.fn(),
    svgResize: jest.fn(),
};

describe('FlyoutBlockGroup', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;

    const mockBlockNode = document.createElement('div');
    mockBlockNode.setAttribute('type', 'variables_get');

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

    it('should render properly', () => {
        render(<FlyoutBlockGroup block_node={mockBlockNode} />, { wrapper });
        expect(screen.getByText(mockBlockMeta.display_name)).toBeInTheDocument();
    });

    it('should call when Learn more is clicked', () => {
        const onInfoClick = jest.fn();
        render(<FlyoutBlockGroup block_node={mockBlockNode} onInfoClick={onInfoClick} />, {
            wrapper,
        });
        userEvent.click(screen.getByText('Learn more'));
        expect(onInfoClick).toHaveBeenCalled();
    });

    it('should display `add button` if block type is set to be variable', () => {
        const mockBlockNode = document.createElement('div');
        mockBlockNode.setAttribute('type', 'variables_set');
        render(<FlyoutBlockGroup block_node={mockBlockNode} />, {
            wrapper,
        });
        const add_button = screen.getByTestId('dt_flyout__add_variables_set');
        userEvent.click(add_button);
        expect(mockAddBlockNode).toHaveBeenCalledWith(mockBlockNode);
    });
});
