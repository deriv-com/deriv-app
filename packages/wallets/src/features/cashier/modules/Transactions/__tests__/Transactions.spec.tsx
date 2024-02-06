import React from 'react';
import { render, screen } from '@testing-library/react';
import Transactions from '../Transactions';

describe('Transactions', () => {
    it('should render <Transactions />', () => {
        render(<Transactions />);

        expect(screen.getByTestId('dt_transactions')).toBeInTheDocument();
    });
});
