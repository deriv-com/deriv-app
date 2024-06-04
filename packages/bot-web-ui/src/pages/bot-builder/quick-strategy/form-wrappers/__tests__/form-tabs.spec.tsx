import React from 'react';
import { Formik } from 'formik';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import FormTabs from '../form-tabs';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

const onChangeMock = jest.fn();
const mock_props = {
    active_tab: 'TRADE_PARAMETERS',
    onChange: onChangeMock,
    description: 'description',
};

describe('<FormTabs />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    const mock_onSubmit = jest.fn();

    beforeEach(() => {
        const mock_store = mockStore({});
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);
        const initial_value = {};

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    <Formik initialValues={initial_value} onSubmit={mock_onSubmit}>
                        {children}
                    </Formik>
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render FormTabs component without description', () => {
        const { container } = render(<FormTabs {...mock_props} description={undefined} />, { wrapper });
        expect(container).toBeInTheDocument();
    });

    it('should render FormTabs component', () => {
        const { container } = render(<FormTabs {...mock_props} />, { wrapper });
        expect(container).toBeInTheDocument();
    });

    it('should not call onChange on click if the tab is disabled', () => {
        const { container } = render(<FormTabs {...mock_props} onChange={() => jest.fn()} />, { wrapper });
        const disabledTab = screen.getByText('Learn more');
        userEvent.click(disabledTab);

        expect(container).toBeInTheDocument();
        expect(onChangeMock).not.toHaveBeenCalled();
    });

    it('should not call onChange on Enter keydown if the tab is disabled', () => {
        const { container } = render(<FormTabs {...mock_props} onChange={() => jest.fn()} />, { wrapper });
        const disabledTab = screen.getByText('Learn more');
        userEvent.type(disabledTab, '{enter}');

        expect(container).toBeInTheDocument();
        expect(onChangeMock).not.toHaveBeenCalled();
    });

    it('should call onChange on click if the tab is not disabled', () => {
        const { container } = render(<FormTabs {...mock_props} />, { wrapper });

        const enabledTab = screen.getByText('Trade parameters');

        userEvent.click(enabledTab);

        expect(container).toBeInTheDocument();
        expect(onChangeMock).toHaveBeenCalledWith('TRADE_PARAMETERS');
    });

    it('should call onChange on Enter keydown if the tab is not disabled', () => {
        const { container } = render(<FormTabs {...mock_props} />, { wrapper });

        const enabledTab = screen.getByText('Trade parameters');

        userEvent.type(enabledTab, '{enter}');

        expect(container).toBeInTheDocument();
        expect(onChangeMock).toHaveBeenCalledWith('TRADE_PARAMETERS');
    });

    it('should not call onChange on Enter keydown if the tab is disabled', () => {
        const { container } = render(<FormTabs {...mock_props} />, { wrapper });

        userEvent.keyboard('{Enter}');

        expect(container).toBeInTheDocument();
        expect(onChangeMock).not.toHaveBeenCalled();
    });

    it('should call onChange on Enter keydown if the tab is not disabled', () => {
        const { container } = render(<FormTabs {...mock_props} />, { wrapper });

        const enabledTab = screen.getByText('Trade parameters');

        userEvent.type(enabledTab, '{enter}');
        userEvent.keyboard('{Enter}');

        expect(onChangeMock).toHaveBeenCalledWith('TRADE_PARAMETERS');
        expect(container).toBeInTheDocument();
    });
});
