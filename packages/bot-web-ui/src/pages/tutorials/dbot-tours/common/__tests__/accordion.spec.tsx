import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import Accordion from '../accordion';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

const mocked_props = {
    content_data: [
        [
            {
                header: 'header 1',
                content: 'content 1',
            },
            {
                header: 'header 2',
                content: 'content 2',
            },

            {
                header: 'header 3',
                content: 'content 3',
            },
        ],
    ],
    expanded: true,
    test_id: 'test_string',
};

describe('<Accordion />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element;
    const mock_store = mockStore({});
    const mock_DBot_store = mockDBotStore(mock_store, mock_ws);

    beforeEach(() => {
        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render Accordion with correct props and content', () => {
        render(<Accordion {...mocked_props} />, { wrapper });
        const accordion = screen.getByTestId('test_string');
        expect(accordion).toBeInTheDocument();
    });

    it('should not render Accordion if content_data is empty', () => {
        const props_with_empty_content = {
            ...mocked_props,
            content_data: null,
        };
        render(<Accordion {...props_with_empty_content} />, { wrapper });
        const accordion = screen.queryByTestId('test_string');
        expect(accordion).not.toBeInTheDocument();
    });

    it('should open accordion', async () => {
        render(<Accordion {...mocked_props} />, { wrapper });
        await waitFor(() => {
            expect(screen.getByTestId('accordion-content')).toHaveClass('dbot-accordion__content--open');
        });
    });
    it('should close accordion', async () => {
        render(<Accordion {...mocked_props} />, { wrapper });
        const accordion = screen.getByTestId('test_string');
        fireEvent.click(accordion);
        await waitFor(() => {
            expect(screen.getByTestId('accordion-content')).not.toHaveClass('dbot-accordion__content--open');
        });
    });
});
