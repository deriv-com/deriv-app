import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import UserGuide from '../user-guide';
import { mocked_props } from './dashboard-component.spec';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');

    return {
        ...original_module,
        Cards: jest.fn(() => 'Cards'),
        messageWithButton: jest.fn(() => 'messageWithButton'),
        arrayAsMessage: jest.fn(() => 'messageWithButton'),
        DesktopWrapper: jest.fn(() => 'DesktopWrapper'),
        MobileWrapper: jest.fn(() => 'MobileWrapper'),
        Text: jest.fn(() => 'Text'),
    };
});
jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());
describe('<UserGuide />', () => {
    it('renders user guide button', () => {
        const mock_store = mockStore({});
        const mock_DBot_store = mockDBotStore(mock_store, mock_ws);
        render(
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    <UserGuide {...mocked_props} />
                </DBotStoreProvider>
            </StoreProvider>
        );
        const use_guide_button = screen.getByTestId('btn-user-guide');
        userEvent.click(use_guide_button);
        expect(screen.getByTestId('btn-user-guide')).toBeInTheDocument();
    });
});
