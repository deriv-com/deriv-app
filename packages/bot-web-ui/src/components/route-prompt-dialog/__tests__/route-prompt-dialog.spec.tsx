import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import RoutePromptDialog from '../route-prompt-dialog';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

describe('RoutePromptDialog', () => {
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

    it('should render RoutePromptDialog', () => {
        mock_DBot_store?.route_prompt_dialog?.setShoudShow(true);
        const { container } = render(<RoutePromptDialog />, { wrapper });
        expect(container).toBeInTheDocument();
    });

    it('should render title of RoutePromptDialog', () => {
        render(<RoutePromptDialog />, { wrapper });
        const title = screen.getByText('Leaving already?');
        expect(title).toBeInTheDocument();
    });

    it('should confirm and hide RoutePromptDialog on clicking confirm button', () => {
        render(<RoutePromptDialog />, { wrapper });
        const confirm_button_text = screen.getByRole('button', { name: "Yes, I'll come back later" });
        userEvent.click(confirm_button_text);
        expect(mock_DBot_store?.route_prompt_dialog?.should_show).toBeFalsy();
        expect(mock_DBot_store?.route_prompt_dialog?.is_confirmed).toBeTruthy();
    });

    it('should hide RoutePromptDialog on clicking cancel button', () => {
        mock_DBot_store?.route_prompt_dialog?.setShoudShow(true);
        render(<RoutePromptDialog />, { wrapper });
        const cancel_button_text = screen.getByRole('button', { name: "No, I'll stay" });
        userEvent.click(cancel_button_text);
        expect(mock_DBot_store?.route_prompt_dialog?.should_show).toBeFalsy();
    });
});
