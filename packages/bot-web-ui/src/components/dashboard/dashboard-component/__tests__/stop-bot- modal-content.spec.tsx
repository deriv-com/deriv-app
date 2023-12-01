import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/index';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import StopBotModalContent from '../stop-bot-modal-content';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

const mocked_props = {
    is_running: false,
    is_dialog_open: false,
    is_contract_dialog_open: false,
    is_stop_bot_dialog_open: false,
    is_multiplier: false,
    closeMultiplierContract: jest.fn(),
    onOkButtonClick: jest.fn(),
    toggleStopBotDialog: jest.fn(),
};

describe('StopBotModalContent', () => {
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

    it('should render the StopBotModalContent component', () => {
        const { container } = render(<StopBotModalContent {...mocked_props} />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });
});
