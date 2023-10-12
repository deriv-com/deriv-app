import React from 'react';
import { mockStore, StoreProvider, useStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws, mockBlockly } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore, useDBotStore } from 'Stores/useDBotStore';
import Toolbox from '../toolbox';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

window.Blockly = mockBlockly({});

describe('Toolbox component', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element;
    const mock_store = mockStore({
        ui: {
            is_mobile: false,
        },
    });
    const mock_DBot_store = mockDBotStore(mock_store, mock_ws);

    beforeAll(() => {
        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    beforeEach(() => {
        render(<Toolbox />, { wrapper });
    });
    it('should render Toolbox with content wrapper is open', () => {
        expect(screen.getByTestId('dashboard__toolbox')).toBeInTheDocument();
        expect(screen.getByTestId('db-toolbox__content-wrapper')).toHaveClass('db-toolbox__content-wrapper active');
    });
    it('should render Toolbox with content wrapper is open', () => {
        expect(screen.getByTestId('db-toolbox__title')).toBeInTheDocument();
        userEvent.click(screen.getByTestId('db-toolbox__title'));
        expect(screen.getByTestId('db-toolbox__content-wrapper')).not.toHaveClass('db-toolbox__content-wrapper active');
    });
    it('should not render Toolbox if it is mobile version', () => {
        if (mock_store.ui.is_mobile) {
            expect(screen.getByRole('dashboard__toolbox')).toBeEmptyDOMElement();
        }
    });
});
