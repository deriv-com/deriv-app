import React from 'react';
import { useStores } from 'Stores';
import { render, screen } from '@testing-library/react';
import Dp2pBlockedDescription from '../dp2p-blocked-description.jsx';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => ({
        general_store: { is_high_risk_fully_authed_without_fa: false },
    })),
}));

describe('<Dp2pBlockedDescription/>', () => {
    it('renders text set 1 when is_high_risk_fully_authed_without_fa is set false', () => {
        render(<Dp2pBlockedDescription />);
        expect(
            screen.getByText('Please use live chat to contact our Customer Support team for help.')
        ).toBeInTheDocument();
    });

    it('renders text set 1 when is_high_risk_fully_authed_without_fa is set false', () => {
        useStores.mockImplementation(() => ({
            general_store: { is_high_risk_fully_authed_without_fa: true },
        }));
        render(<Dp2pBlockedDescription />);
        expect(screen.getByText('To enable this feature you must complete the following:')).toBeInTheDocument();
    });
});
