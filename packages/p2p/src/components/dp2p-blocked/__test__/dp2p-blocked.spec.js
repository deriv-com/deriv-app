import React from 'react';
import { render, screen } from '@testing-library/react';
import Dp2pBlocked from '../dp2p-blocked.jsx';

jest.mock('Components/dp2p-blocked/dp2p-blocked-checklist.jsx', () => jest.fn(() => <div>Dp2pBlockedChecklist</div>));

jest.mock('Components/dp2p-blocked/dp2p-blocked-description.jsx', () =>
    jest.fn(() => <div>Dp2pBlockedDescription</div>)
);

describe('<Dp2pBlocked/>', () => {
    it('Renders the icon as well as text message when component gets loaded', () => {
        render(<Dp2pBlocked />);
        expect(screen.getByTestId('dp2p-blocked')).toBeInTheDocument();
        expect(screen.getByText('Your Deriv P2P cashier is blocked')).toBeInTheDocument();
    });

    it('Renders the checklist and Description', () => {
        render(<Dp2pBlocked />);
        expect(screen.getByText('Dp2pBlockedChecklist')).toBeInTheDocument();
        expect(screen.getByText('Dp2pBlockedDescription')).toBeInTheDocument();
    });
});
