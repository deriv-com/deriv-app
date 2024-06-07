import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import FormTabs from '../form-tabs';
import { FORM_TABS } from '../../config';
import { quick_strategy_content } from '../../../../tutorials/constants';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

const onChangeMock = jest.fn();
const mock_props = {
    active_tab: FORM_TABS[0].value,
    onChange: onChangeMock,
    description: quick_strategy_content[0].content[0],
};

describe('<FormTabs />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;

    beforeEach(() => {
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

    it('should render FormTabs component without description', () => {
        const { container } = render(<FormTabs {...mock_props} description={undefined} />, { wrapper });
        expect(container).not.toBeEmptyDOMElement();
    });

    it('should render FormTabs component', () => {
        const { container } = render(<FormTabs {...mock_props} />, { wrapper });
        expect(container).not.toBeEmptyDOMElement();
    });

    it('should not call onChange on click if the tab is disabled', () => {
        const { container } = render(<FormTabs {...mock_props} onChange={() => jest.fn()} />, { wrapper });
        const disabledTab = screen.getByText(FORM_TABS[1].label);
        userEvent.click(disabledTab);

        expect(container).not.toBeEmptyDOMElement();
        expect(onChangeMock).not.toHaveBeenCalled();
    });

    it('should not call onChange on Enter keydown if the tab is disabled', () => {
        const { container } = render(<FormTabs {...mock_props} onChange={() => jest.fn()} />, { wrapper });
        const disabledTab = screen.getByText(FORM_TABS[1].label);
        userEvent.type(disabledTab, '{enter}');

        expect(container).not.toBeEmptyDOMElement();
        expect(onChangeMock).not.toHaveBeenCalled();
    });

    it('should call onChange on click if the tab is not disabled', () => {
        const { container } = render(<FormTabs {...mock_props} />, { wrapper });

        const enabledTab = screen.getByText(FORM_TABS[0].label);

        userEvent.click(enabledTab);

        expect(container).not.toBeEmptyDOMElement();
        expect(onChangeMock).toHaveBeenCalledWith(FORM_TABS[0].value);
    });

    it('should call onChange on Enter keydown if the tab is not disabled', () => {
        const { container } = render(<FormTabs {...mock_props} />, { wrapper });

        const enabledTab = screen.getByText(FORM_TABS[0].label);

        userEvent.type(enabledTab, '{enter}');

        expect(container).not.toBeEmptyDOMElement();
        expect(onChangeMock).toHaveBeenCalledWith(FORM_TABS[0].value);
    });

    it('should not call onChange on Enter keydown if the tab is disabled', () => {
        const { container } = render(<FormTabs {...mock_props} />, { wrapper });

        userEvent.keyboard('{Enter}');

        expect(container).not.toBeEmptyDOMElement();
        expect(onChangeMock).not.toHaveBeenCalled();
    });

    it('should call onChange on Enter keydown if the tab is not disabled', () => {
        const { container } = render(<FormTabs {...mock_props} />, { wrapper });

        const enabledTab = screen.getByText(FORM_TABS[0].label);

        userEvent.type(enabledTab, '{enter}');
        userEvent.keyboard('{Enter}');

        expect(onChangeMock).toHaveBeenCalledWith(FORM_TABS[0].value);
        expect(container).not.toBeEmptyDOMElement();
    });
});
