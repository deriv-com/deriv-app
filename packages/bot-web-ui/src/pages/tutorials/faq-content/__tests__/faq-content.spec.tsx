import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import { faq_content } from '../../constants';
import FAQContent, { scrollToElement } from '..';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

jest.useFakeTimers();

const what_is_deriv_bot = 'What is Deriv Bot?';
const deriv_bot_content =
    "Deriv Bot is a web-based strategy builder for trading digital options. It’s a platform where you can build your own automated trading bot using drag-and-drop 'blocks'.";

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
        expect(screen.getByTestId('dt_faq_wrapper')).toBeInTheDocument();
    });

    it('should show content after clicking on accordion', () => {
        render(<FAQContent faq_list={faq_content} />, { wrapper });
        const accordion = screen.getByTestId('dt_accordion_test');
        userEvent.click(accordion);
        expect(accordion).toHaveTextContent(deriv_bot_content);
    });

    it('should show faq content in text size-s on desktop', () => {
        mock_store.ui.is_desktop = true;

        render(<FAQContent faq_list={faq_content} />, { wrapper });
        const faq = screen.getByText(what_is_deriv_bot);
        expect(faq).toHaveStyle('--text-size: var(--text-size-s);');
    });

    it('should show faq content in text size-xs on mobile', () => {
        mock_store.ui.is_desktop = false;

        render(<FAQContent faq_list={faq_content} />, { wrapper });
        const faq = screen.getByText(what_is_deriv_bot);
        expect(faq).toHaveStyle('--text-size: var(--text-size-xs);');
    });

    it('should call handleAccordionOpen and accordion item should open on desktop', () => {
        mock_store.ui.is_desktop = true;
        render(<FAQContent faq_list={faq_content} />, { wrapper });

        const accordion = screen.getByTestId('dt_accordion_test');
        expect(accordion).toBeInTheDocument();

        const faq = screen.getByText(what_is_deriv_bot);
        userEvent.click(faq);
        jest.advanceTimersByTime(5);
        expect(screen.getByText(deriv_bot_content)).toBeInTheDocument();
    });

    it('should call handleAccordionOpen and accordion item should open on mobile', () => {
        mock_store.ui.is_desktop = false;
        render(<FAQContent faq_list={faq_content} />, { wrapper });

        const accordion = screen.getByTestId('dt_accordion_test');
        expect(accordion).toBeInTheDocument();

        const faq = screen.getByText(what_is_deriv_bot);
        userEvent.click(faq);
        jest.advanceTimersByTime(5);
        expect(screen.getByText(deriv_bot_content)).toBeInTheDocument();
    });

    it('should call handleAccordionOpen and accordion item should close', () => {
        render(<FAQContent faq_list={faq_content} />, { wrapper });

        const accordion = screen.getByTestId('dt_accordion_test');
        expect(accordion).toBeInTheDocument();

        userEvent.click(accordion);
        jest.advanceTimersByTime(5);
        expect(screen.getByText(what_is_deriv_bot)).toBeInTheDocument();
    });

    it('should trigger the keyDown event upon clicking "Enter"', () => {
        render(<FAQContent faq_list={faq_content} />, { wrapper });

        const accordion = screen.getByTestId('dt_accordion_test');
        userEvent.type(accordion, '{enter}');
        expect(screen.getByText(deriv_bot_content)).toBeInTheDocument();
    });
    it('should not trigger the keyDown event upon clicking "esc"', () => {
        render(<FAQContent faq_list={faq_content} />, { wrapper });

        const accordion = screen.getByTestId('dt_accordion_test');
        userEvent.type(accordion, '{esc}');
        expect(screen.getByText(what_is_deriv_bot)).toBeInTheDocument();
    });

    it('should call handleAccordionOpen and click the correct accordion item when faq_title matches search_id', () => {
        const mockHandleTabChange = jest.fn();
        mock_DBot_store.dashboard.faq_title = 'faq-1';
        render(<FAQContent faq_list={faq_content} handleTabChange={mockHandleTabChange} />, { wrapper });

        const faq_title = screen.getAllByText(what_is_deriv_bot);
        faq_title.forEach(element => {
            element.click = jest.fn();
        });

        jest.advanceTimersByTime(5);
        expect(screen.getByText(deriv_bot_content)).toBeInTheDocument();
    });

    it('should call scrollTo with the correct parameters when wrapper_element is valid', () => {
        const mockWrapperElement = {
            scrollTo: jest.fn(),
        } as unknown as HTMLElement;

        const offset = 100;
        scrollToElement(mockWrapperElement, offset);

        expect(mockWrapperElement.scrollTo).toHaveBeenCalledWith({
            top: offset,
            behavior: 'smooth',
        });
    });
});
