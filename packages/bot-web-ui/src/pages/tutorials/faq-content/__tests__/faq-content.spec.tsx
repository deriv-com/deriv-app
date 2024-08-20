import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DBOT_TABS } from 'Constants/bot-contents';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import { faq_content } from '../../constants';
import FAQContent from '..';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

describe('<FAQContent />', () => {
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

    it('should render FAQContent', () => {
        render(<FAQContent faq_list={faq_content} />, { wrapper });
        expect(screen.getByTestId('id-faq__wrapper')).toBeInTheDocument();
    });

    it('should show content after clicking on accordion', () => {
        render(<FAQContent faq_list={faq_content} />, { wrapper });
        const accordion = screen.getByTestId('id-accordion-test');
        userEvent.click(accordion);
        expect(accordion).toHaveTextContent('Deriv Bot is a web-based strategy builder for trading digital options.');
    });

    it('should show faq content in text size-s on desktop', () => {
        mock_store.ui.is_desktop = true;

        render(<FAQContent faq_list={faq_content} />, { wrapper });
        const faq = screen.getByText('What is Deriv Bot?');
        expect(faq).toHaveStyle('--text-size: var(--text-size-s);');
    });

    it('should show faq content in text size-xs on mobile', () => {
        mock_store.ui.is_desktop = false;

        render(<FAQContent faq_list={faq_content} />, { wrapper });
        const faq = screen.getByText('What is Deriv Bot?');
        expect(faq).toHaveStyle('--text-size: var(--text-size-xs);');
    });

    it('should change tab to tutorials on clicking info panel', () => {
        const mockHandleTabChange = jest.fn();

        render(<FAQContent faq_list={faq_content} handleTabChange={mockHandleTabChange} />, { wrapper });

        // eslint-disable-next-line testing-library/no-node-access
        const clickedElement = document.querySelectorAll('.faq__title')[1];
        expect(clickedElement).toHaveTextContent('Where do I find the blocks I need?');

        if (clickedElement) {
            userEvent.click(clickedElement);
            expect(mock_DBot_store.dashboard.faq_title).toBe('');
            expect(mock_DBot_store?.dashboard.setActiveTab(DBOT_TABS.TUTORIAL));
        }
    });
});
