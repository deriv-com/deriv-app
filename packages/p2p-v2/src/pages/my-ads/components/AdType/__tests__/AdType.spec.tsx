import React from 'react';
import { render, screen } from '@testing-library/react';
import AdType from '../AdType';

const mockProps = {
    adPauseColor: 'red',
    floatRate: '1.23',
};

describe('AdType', () => {
    it('should render the component as expected', () => {
        render(<AdType {...mockProps} />);
        expect(screen.getByText('Float')).toBeInTheDocument();
        expect(screen.getByText('1.23%')).toBeInTheDocument();
    });
});
