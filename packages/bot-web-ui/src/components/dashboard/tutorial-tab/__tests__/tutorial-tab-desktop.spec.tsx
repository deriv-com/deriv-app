import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent, render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import TutorialsTabDesktop from '../tutorials-tab-desktop';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

describe('<TutorialsTabDesktop />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element;
    const mock_store = mockStore({
        ui: {
            is_mobile: false,
        },
    });
    const mock_DBot_store = mockDBotStore(mock_store, mock_ws);

    beforeEach(() => {
        mock_DBot_store?.quick_strategy?.setValue('durationtype', 't');
        mock_DBot_store?.quick_strategy?.setSelectedStrategy('MARTINGALE');
        mock_DBot_store?.quick_strategy?.setFormVisibility(true);
        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
        render(
            <BrowserRouter>
                <TutorialsTabDesktop />
            </BrowserRouter>,
            {
                wrapper,
            }
        );
    });

    it('should render tutorials tab for desktop', () => {
        const inputElement = screen.getByTestId('id-test-input-search');
        expect(inputElement).toBeInTheDocument();
    });

    it('should call onFocusSearch when input is focused', () => {
        const inputElement = screen.getByTestId('id-test-input-search');
        expect(inputElement).not.toHaveFocus();

        fireEvent.focus(inputElement);

        expect(inputElement).toHaveFocus();
    });

    it('should call onSearch when input value changes', () => {
        const inputElement = screen.getByTestId('id-test-input-search');
        const inputValue = 'Test search query';

        fireEvent.change(inputElement, { target: { value: inputValue } });

        expect(inputElement.value).toBe(inputValue);
    });

    it('should clear Search on input when clicked on close', () => {
        const inputElement = screen.getByTestId('id-test-input-search');
        const inputValue = 'Test search query';
        const checkinputValue = '';

        fireEvent.change(inputElement, { target: { value: inputValue } });

        const closeIcon = screen.getByTestId('id-test-close');
        userEvent.click(closeIcon);

        expect(inputElement.value).toBe(checkinputValue);
    });
});
