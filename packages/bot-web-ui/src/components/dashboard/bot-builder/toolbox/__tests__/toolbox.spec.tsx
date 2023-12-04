import React from 'react';
import { isMobile } from '@deriv/shared';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DBotStoreProvider, mockDBotStore, useDBotStore } from 'Stores/useDBotStore';
import Toolbox from '../toolbox';
import { StoreProvider, mockStore } from '@deriv/stores';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
}));

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({}));

jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

const mockGetBoundingClientRect = jest.fn(() => ({
    top: 10,
    left: 20,
    right: 30,
    bottom: 40,
    width: 10,
    height: 20,
}));

window.Blockly = {
    derivWorkspace: {
        svgBlockCanvas_: {
            getBoundingClientRect: mockGetBoundingClientRect,
        },
    },
    Xml: { textToDom: () => ({}) },
    Colours: { RootBlock: {} },
};

describe('Toolbox component', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;

    beforeEach(() => {
        const mock_store = mockStore({
            ui: {
                is_mobile: true,
            },
        });
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render Toolbox component', () => {
        const { container } = render(<Toolbox />, { wrapper });
        expect(container).toBeInTheDocument();
    });
});
