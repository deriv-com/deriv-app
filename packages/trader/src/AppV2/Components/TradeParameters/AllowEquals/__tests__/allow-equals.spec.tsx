import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore } from '@deriv/stores';
import ModulesProvider from 'Stores/Providers/modules-providers';
import { hasCallPutEqual, hasDurationForCallPutEqual } from 'Stores/Modules/Trading/Helpers/allow-equals';
import TraderProviders from '../../../../../trader-providers';
import { ReportsStoreProvider } from '../../../../../../../reports/src/Stores/useReportsStores';
import AllowEquals from '../allow-equals';

jest.mock('Stores/Modules/Trading/Helpers/allow-equals', () => ({
    ...jest.requireActual('Stores/Modules/Trading/Helpers/allow-equals'),
    hasCallPutEqual: jest.fn(() => true),
    hasDurationForCallPutEqual: jest.fn(() => true),
}));

const title = 'Allow equals';
const mediaQueryList = {
    matches: true,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
};

window.matchMedia = jest.fn().mockImplementation(() => mediaQueryList);

describe('AllowEquals', () => {
    let default_mock_store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        default_mock_store = mockStore({});
    });

    const mockAllowEquals = () => {
        return (
            <TraderProviders store={default_mock_store}>
                <ReportsStoreProvider>
                    <ModulesProvider store={default_mock_store}>
                        <AllowEquals is_minimized />
                    </ModulesProvider>
                </ReportsStoreProvider>
            </TraderProviders>
        );
    };

    it('should not render component if hasCallPutEqual return false', () => {
        (hasCallPutEqual as jest.Mock).mockReturnValueOnce(false);
        const { container } = render(mockAllowEquals());

        expect(container).toBeEmptyDOMElement();
    });

    it('should not render component if hasDurationForCallPutEqual return false', () => {
        (hasDurationForCallPutEqual as jest.Mock).mockReturnValueOnce(false);
        const { container } = render(mockAllowEquals());

        expect(container).toBeEmptyDOMElement();
    });

    it('should render component with correct input value if is_equal is 0', () => {
        render(mockAllowEquals());

        expect(screen.getByText(title)).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toHaveValue('-');
    });

    it('should render component with correct input value if is_equal is 1', () => {
        default_mock_store.modules.trade.is_equal = 1;
        render(mockAllowEquals());

        expect(screen.getByText(title)).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toHaveValue('Enabled');
    });

    it('should show ActionSheet if user clicks on input', () => {
        render(mockAllowEquals());

        userEvent.click(screen.getByRole('textbox'));

        expect(screen.getByRole('dialog')).toHaveAttribute('data-state', 'open');
    });

    it('should call onChange function if user opens ActionSheet, changes ToggleSwitch and clicks on "Save" button', () => {
        render(mockAllowEquals());

        userEvent.click(screen.getByRole('textbox'));

        const [toggle_switch_button, save_button] = screen.getAllByRole('button');
        expect(toggle_switch_button).toHaveAttribute('aria-pressed', 'false');
        userEvent.click(toggle_switch_button);
        expect(toggle_switch_button).toHaveAttribute('aria-pressed', 'true');

        userEvent.click(save_button);
        expect(default_mock_store.modules.trade.onChange).toBeCalled();
    });
});
