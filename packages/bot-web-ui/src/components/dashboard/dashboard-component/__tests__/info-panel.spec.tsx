import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { DBOT_TABS } from 'Constants/bot-contents';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/index';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import InfoPanel from '../info-panel';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

describe('InfoPanel', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;

    beforeAll(() => {
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

    it('should render the InfoPanel component', () => {
        const { container } = render(<InfoPanel />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
        expect(screen.getByText('Welcome to Deriv Bot!')).toBeInTheDocument();
    });

    it('should render the closing of the info panel on close icon click', () => {
        render(<InfoPanel />, { wrapper });

        const close = screen.getByTestId('close-icon');
        userEvent.click(close);
        expect(mock_DBot_store?.dashboard.is_info_panel_visible).toBeFalsy();
    });

    it('should render the switching of tabs upon clicking the text link', () => {
        render(<InfoPanel />, { wrapper });

        const tab_switch = screen.getByText('Deriv Bot - your automated trading partner');
        userEvent.click(tab_switch);
        expect(mock_DBot_store?.dashboard.setActiveTab(DBOT_TABS.TUTORIAL));
    });
});
