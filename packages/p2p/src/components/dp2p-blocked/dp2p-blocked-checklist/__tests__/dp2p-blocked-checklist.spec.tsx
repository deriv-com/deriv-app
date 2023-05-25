import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useStores } from 'Stores/index';
import Dp2pBlockedChecklist from '..';

const mockHistoryPush = jest.fn();

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

describe('<Dp2pBlockedChecklist />', () => {
    it('it should render <Dp2pBlockedChecklist /> component if client is high risk and not blocked', () => {
        (useStores as jest.Mock).mockReturnValue({
            general_store: {
                is_high_risk: true,
                is_blocked: false,
            },
        });
        render(<Dp2pBlockedChecklist />);
        expect(screen.getByText('Complete the financial assessment form')).toBeInTheDocument();
    });

    it('it should redirect to `/account/financial-assessment` while clicking on checklist button if client is high risk and not blocked', () => {
        (useStores as jest.Mock).mockReturnValue({
            general_store: {
                is_high_risk: true,
                is_blocked: false,
            },
        });
        render(<Dp2pBlockedChecklist />);
        userEvent.click(screen.getByTestId('dt_checklist_item_status_action'));
        expect(mockHistoryPush).toHaveBeenCalledWith({ pathname: '/account/financial-assessment' });
    });

    it('it should return null when client is not high risk', () => {
        (useStores as jest.Mock).mockReturnValue({
            general_store: {
                is_high_risk: false,
                is_blocked: false,
            },
        });
        const { container } = render(<Dp2pBlockedChecklist />);
        expect(container).toBeEmptyDOMElement();
    });
});
