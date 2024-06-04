import React from 'react';
import { toMoment } from '@deriv/shared';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import Journal from '../journal';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

jest.mock('../journal-components/journal-loader.tsx', () => jest.fn(() => 'JournalLoader'));

window.Blockly = {
    utils: {
        genUid: jest.fn(),
    },
};

describe('Journal', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element;
    const mock_store = mockStore({});
    const mock_DBot_store = mockDBotStore(mock_store, mock_ws);

    beforeAll(() => {
        Object.defineProperties(window.HTMLElement.prototype, {
            offsetHeight: {
                get() {
                    return 100;
                },
            },
            offsetWidth: {
                get() {
                    return 100;
                },
            },
        });
        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    test('should renders Journal component', () => {
        render(<Journal />, { wrapper });

        const journal = screen.getByTestId('dt_mock_journal');

        expect(journal).toBeInTheDocument();
    });

    test('should renders Journal component when filtered messages are empty', () => {
        render(<Journal />, { wrapper });

        const journal = screen.getByTestId('dt_mock_journal');

        const expected_messages = [
            'There are no messages to display',
            'The bot is not running',
            'The stats are cleared',
            'All messages are filtered out',
        ];

        expect(journal).toBeInTheDocument();
        expected_messages.forEach(message => {
            expect(screen.getByText(message)).toBeInTheDocument();
        });
    });

    test('should renders Journal component when filtered messages are exist', () => {
        mock_store.common.server_time = toMoment();
        mock_DBot_store?.journal.pushMessage('welcome_back', 'success', 'journal__text', { current_currency: 'USD' });

        render(<Journal />, { wrapper });

        const journal = screen.getByTestId('dt_mock_journal');
        const data_list = screen.getByTestId('dt_data_list');

        expect(journal).toBeInTheDocument();
        expect(data_list).toBeInTheDocument();
    });

    test('should renders Journal component when it has checked filters, unfiltered messages are empty and the stop button is visible', () => {
        mock_DBot_store?.journal.clear();
        mock_DBot_store?.run_panel.setIsRunning(true);
        mock_DBot_store?.run_panel.setContractStage(2);

        render(<Journal />, { wrapper });

        const journal = screen.getByTestId('dt_mock_journal');

        expect(journal).toBeInTheDocument();
    });
});
