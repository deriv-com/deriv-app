import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore } from '@deriv/stores';
import ModulesProvider from 'Stores/Providers/modules-providers';
import { hasCallPutEqual, hasDurationForCallPutEqual } from 'Stores/Modules/Trading/Helpers/allow-equals';
import TraderProviders from '../../../../../trader-providers';
import AllowEquals from '../allow-equals';

jest.mock('Stores/Modules/Trading/Helpers/allow-equals', () => ({
    ...jest.requireActual('Stores/Modules/Trading/Helpers/allow-equals'),
    hasCallPutEqual: jest.fn(() => true),
    hasDurationForCallPutEqual: jest.fn(() => true),
}));

const title = 'Allow equals';

describe('AllowEquals', () => {
    let default_mock_store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        default_mock_store = mockStore({});
    });

    const mockAllowEquals = () => {
        return (
            <TraderProviders store={default_mock_store}>
                <ModulesProvider store={default_mock_store}>
                    <AllowEquals />
                </ModulesProvider>
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

    it('should render component with correct ToggleSwitch state value if is_equal is 0', () => {
        render(mockAllowEquals());

        expect(screen.getByText(title)).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
    });

    it('should render component with correct ToggleSwitch state value if is_equal is 1', () => {
        default_mock_store.modules.trade.is_equal = 1;
        render(mockAllowEquals());

        expect(screen.getByText(title)).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    });

    it('should call onChange function if user clicks on ToggleSwitch', () => {
        render(mockAllowEquals());

        userEvent.click(screen.getByRole('button'));

        expect(default_mock_store.modules.trade.onChange).toBeCalled();
    });

    it('should render ActionSheet with definition if user clicks on "Allow equal" term', () => {
        render(mockAllowEquals());

        userEvent.click(screen.getByText(title));

        expect(screen.getByText('Win payout if exit spot is also equal to entry spot.')).toBeInTheDocument();
        expect(screen.getByText('Got it')).toBeInTheDocument();
    });
});
