import React from 'react';
import { render, screen } from '@testing-library/react';
import Badge from '../Badge';

describe('Badge', () => {
    it('should render the label and statuses correctly', () => {
        render(<Badge label='Trades' status='100+' variant='general' />);
        expect(screen.getByText('Trades')).toBeInTheDocument();
        expect(screen.getByText('100+')).toBeInTheDocument();
    });
});
