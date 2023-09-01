import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent, render, screen } from '@testing-library/react';
import RootStore from 'Stores/index';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import Draggable from '../draggable';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: () => false,
}));

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

const mock_ws = {
    authorized: {
        subscribeProposalOpenContract: jest.fn(),
        send: jest.fn(),
    },
    storage: {
        send: jest.fn(),
    },
    contractUpdate: jest.fn(),
    subscribeTicksHistory: jest.fn(),
    forgetStream: jest.fn(),
    activeSymbols: jest.fn(),
    send: jest.fn(),
};
describe('Draggable', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;

    beforeEach(() => {
        jest.resetModules();
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
    it('should render Draggable', () => {
        render(<Draggable is_visible={true} onCloseDraggable={jest.fn()} header_title='dummy' />, { wrapper });
        expect(screen.getByTestId('react-rnd-wrapper')).toBeInTheDocument();
    });
    it('should not render Draggable', () => {
        render(<Draggable is_visible={false} onCloseDraggable={jest.fn()} header_title='' />, { wrapper });
        const draggable_element = screen.queryByTestId('react-rnd-wrapper');
        expect(draggable_element).not.toBeInTheDocument();
    });
    it('should call onClose function on close button click', () => {
        const mock_close = jest.fn();
        render(<Draggable is_visible={true} onCloseDraggable={mock_close} header_title='' />, { wrapper });
        const close_btn = screen.getByTestId('react-rnd-close-modal');
        fireEvent.click(close_btn);
        expect(mock_close).toBeCalled();
    });
});
