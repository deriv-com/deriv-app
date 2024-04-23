import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import RootStore from '../../../stores/root-store';
import { DBotStoreProvider, mockDBotStore } from '../../../stores/useDBotStore';
import { NotificationContent } from '../bot-notification';

jest.mock('react-toastify/dist/ReactToastify.css', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));

describe('BotNotification', () => {
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
    it('should render NotificationContent component', () => {
        const { container } = render(<NotificationContent message='' />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });
});
