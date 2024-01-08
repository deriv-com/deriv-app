import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import QuickStrategyGuidesDetails from '../quick-strategy-guides-details';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

const mockQuickStrategyTabContent = [
    {
        qs_name: 'Martingale',
        content: ['Explore Martingale'],
        type: 'Text',
    },
];

const setTutorialSelectedStrategyMock = jest.fn();

describe('<QuickStrategyGuidesDetail />', () => {
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

    it('renders QuickStrategyGuidesDetail component with tutorial_selected_strategy as empty string', () => {
        render(
            <QuickStrategyGuidesDetails
                quick_strategy_tab_content={mockQuickStrategyTabContent}
                tutorial_selected_strategy=''
                setTutorialSelectedStrategy={setTutorialSelectedStrategyMock}
            />,
            {
                wrapper,
            }
        );

        expect(screen.getByText('Explore Martingale')).toBeInTheDocument();
    });

    it('On press of enter keydown should run', async () => {
        const mockEventListener = jest.fn();
        document.addEventListener('keydown', mockEventListener);
        render(
            <QuickStrategyGuidesDetails
                quick_strategy_tab_content={mockQuickStrategyTabContent}
                tutorial_selected_strategy=''
                setTutorialSelectedStrategy={setTutorialSelectedStrategyMock}
            />,
            {
                wrapper,
            }
        );
        const input = screen.getByTestId('quick-strategy-guides-details');
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
        expect(mockEventListener).toHaveBeenCalledWith(expect.objectContaining({ key: 'Enter', code: 'Enter' }));
    });
});
