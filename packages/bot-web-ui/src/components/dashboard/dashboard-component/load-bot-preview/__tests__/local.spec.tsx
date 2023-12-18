import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { DBOT_TABS } from 'Constants/bot-contents';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/index';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import Local from '../local';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

describe('local', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    const mock_store = mockStore({});

    beforeEach(() => {
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render the Local component', () => {
        const { container } = render(<Local />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    it('should render the preview button to open tutorial tab', () => {
        render(<Local />, { wrapper });

        const user_guide = screen.getByRole('button', { name: 'User Guide' });
        userEvent.click(user_guide);
        expect(mock_DBot_store?.dashboard.setActiveTab(DBOT_TABS.TUTORIAL));
    });

    it('should render the open button to open bot builder tab', async () => {
        render(<Local />, { wrapper });

        const open = screen.getByRole('button', { name: 'Open' });
        await waitFor(() => {
            async () => {
                await userEvent.click(open);
                expect(mock_DBot_store?.dashboard.setActiveTab(DBOT_TABS.BOT_BUILDER));
                expect(mock_DBot_store?.dashboard.setPreviewOnDialog).toBeCalledWith(false);
                // expect(mock_DBot_store?.dashboard.setPreviewOnDialog).toBeFalsy();
                expect(mock_DBot_store?.load_modal.loadFileFromRecent).toBeCalled();
            };
        });
    });

    it('should close the preview dialog when clicking the close button', () => {
        mock_store.ui.is_mobile = true;
        render(<Local />, { wrapper });

        const cancel_button = screen.getByRole('button', { name: '' });
        userEvent.click(cancel_button);
        expect(mock_DBot_store?.dashboard.has_mobile_preview_loaded).toBeFalsy();
    });
});
