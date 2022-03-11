import React from 'react';
import { useStores } from 'Stores';
import { fireEvent, render, screen } from '@testing-library/react';
import Dp2pBlockedChecklist from '../dp2p-blocked-checklist.jsx';

const mock_general_store = {
    is_high_risk_fully_authed_without_fa: true,
    props: {
        history: {
            push: jest.fn(),
        },
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => ({
        general_store: mock_general_store,
    })),
}));

describe('<Dp2pBlockedChecklist/>', () => {
    it('should render the checklist for all items passed', () => {
        render(<Dp2pBlockedChecklist />);
        expect(screen.getAllByTestId('checklist').length).toBe(1);
    });

    it('should invoke the push() when icon is clicked', () => {
        const { general_store } = useStores();
        render(<Dp2pBlockedChecklist />);
        fireEvent.click(screen.getByTestId('action_icArrowRightBold'));
        expect(general_store.props.history.push).toHaveBeenCalled();
    });

    it('should not render the component when is_high_risk_fully_authed_without_fa is set to false', () => {
        useStores.mockImplementation(() => ({
            general_store: { ...mock_general_store, is_high_risk_fully_authed_without_fa: false },
        }));
        render(<Dp2pBlockedChecklist />);
        expect(screen.queryByTestId('dp2p-blocked_checklist')).not.toBeInTheDocument();
    });
});
