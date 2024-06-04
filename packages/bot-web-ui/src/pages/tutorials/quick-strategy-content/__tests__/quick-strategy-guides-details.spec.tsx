import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

    it('should render QuickStrategyGuidesDetail component', () => {
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

    it('should render onClick on press of enter keydown', async () => {
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
        const input = screen.getByTestId('dt_quick_strategy_guides_details');
        userEvent.type(input, '{Enter}');
        expect(mockEventListener).toHaveBeenCalledWith(expect.objectContaining({ key: 'Enter', code: 'Enter' }));
    });

    it('should not render onClick on press of space keydown', () => {
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
        const input = screen.getByTestId('dt_quick_strategy_guides_details');
        userEvent.type(input, 'Space');
        expect(mockEventListener).not.toHaveBeenCalledWith(expect.objectContaining({ key: 'Enter', code: 'Enter' }));
    });

    it('should render back with click on breadcrumb', () => {
        render(
            <QuickStrategyGuidesDetails
                quick_strategy_tab_content={mockQuickStrategyTabContent}
                tutorial_selected_strategy='D_ALEMBERT'
                setTutorialSelectedStrategy={setTutorialSelectedStrategyMock}
            />,
            {
                wrapper,
            }
        );
        const breadcrumb = screen.getByText('Quick strategy guides >');
        userEvent.click(breadcrumb);
        expect(setTutorialSelectedStrategyMock).toBeCalledWith('');
    });
});
