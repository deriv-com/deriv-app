import React from 'react';
import { render, screen } from '@testing-library/react';
import Dp2pBlocked from '../dp2p-blocked';

describe('<Dp2pBlocked />', () => {
    it('it should render <Dp2pBlocked /> component', () => {
        render(<Dp2pBlocked />);
        expect(screen.getByText('Your Deriv P2P cashier is blocked')).toBeInTheDocument();
    });
});
