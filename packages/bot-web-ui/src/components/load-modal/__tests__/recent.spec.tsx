import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import Recent from '../recent';
import userEvent from '@testing-library/user-event';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

const strategy = {
    name: '',
    xml: '',
    save_type: '',
    timestamp: 1,
};

const recent_strategies = [
    { ...strategy, name: 'martingale', id: '1' },
    { ...strategy, name: 'd_alembert', id: '2' },
    { ...strategy, name: 'oscar_grind', id: '3' },
];

describe('Recent component of load modal', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element;

    const mock_store = mockStore({});
    const mock_DBot_store = mockDBotStore(mock_store, mock_ws);

    beforeAll(() => {
        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render Recent component without any recent bots strategies when recent_strategies array is empty', () => {
        const { container } = render(<Recent />, { wrapper });

        const text_message = screen.getByText('You do not have any recent bots');
        expect(text_message).toBeInTheDocument();
        expect(container).toBeInTheDocument();
    });

    it('should render Recent component with recent bots strategies, title and preview when recent_strategies are exist', () => {
        mock_DBot_store?.load_modal.setRecentStrategies(recent_strategies);
        const { container } = render(<Recent />, { wrapper });
        const strategy_previw = screen.getByText('Preview');
        expect(strategy_previw).toBeInTheDocument();
        expect(container).toBeInTheDocument();
    });

    it("should close and open the accordion on click of 'Why can't I see my recent bots'", () => {
        mock_DBot_store?.load_modal.setRecentStrategies([]);
        render(<Recent />, { wrapper });
        const accordion = screen.getByTestId('dt-load-strategy__recent__empty-expand');
        accordion.focus();

        userEvent.keyboard('[Enter]');

        const is_empty_explanation_list_visible = screen.getByTestId('dt-empty-explanation-list--open');
        expect(is_empty_explanation_list_visible).toBeInTheDocument();

        userEvent.keyboard('[Enter]');

        const is_empty_explanation_list_hidden = screen.getByTestId('dt-empty-explanation-list--close');
        expect(is_empty_explanation_list_hidden).toBeInTheDocument();
    });
});
