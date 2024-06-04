import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import BotPreview from '../bot-preview';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());
describe('BotPreview', () => {
    it('should render BotPreview component with ref', () => {
        const mock_store = mockStore({});
        const mock_DBot_store = mockDBotStore(mock_store, mock_ws);
        const ref = React.createRef<HTMLDivElement>();

        render(
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    <BotPreview id_ref={ref} />
                </DBotStoreProvider>
            </StoreProvider>
        );

        expect(ref.current).toBeInTheDocument();
    });
});
