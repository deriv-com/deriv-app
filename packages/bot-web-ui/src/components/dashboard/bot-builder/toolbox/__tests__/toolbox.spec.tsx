import React from 'react';
import { isMobile } from '@deriv/shared';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import Toolbox from '../toolbox';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

window.Blockly = {
    Colours: {
        RootBlock: {},
    },
    derivWorkspace: {
        svgBlockCanvas_: {
            getBoundingClientRect: jest.fn(),
        },
        options: {
            readOnly: true,
        },
    },
    Xml: {
        textToDom: () => ({
            childNodes: [
                {
                    tagName: 'example',
                },
            ],
        }),
    },
};
describe('Toolbox component', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element;
    beforeAll(() => {
        const mock_store = mockStore({});
        const mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });
    it('should render Toolbox with content wrapper is open', () => {
        render(<Toolbox />, { wrapper });
        expect(screen.getByTestId('dashboard__toolbox')).toBeInTheDocument();
        expect(screen.getByTestId('db-toolbox__content-wrapper')).toHaveClass('db-toolbox__content-wrapper active');
    });
    it('should render Toolbox with content wrapper is open', () => {
        render(<Toolbox />, { wrapper });

        expect(screen.getByTestId('db-toolbox__title')).toBeInTheDocument();

        userEvent.click(screen.getByTestId('db-toolbox__title'));
        expect(screen.getByTestId('db-toolbox__content-wrapper')).not.toHaveClass('db-toolbox__content-wrapper active');
    });
    it('should not render Toolbox if it is mobile version', () => {
        render(<Toolbox />, { wrapper });
        expect(screen.getByTestId('dashboard__toolbox')).toBeInTheDocument();
        if (isMobile()) {
            expect(screen.getByRole('dashboard__toolbox')).toBeEmptyDOMElement();
        }
    });
});
