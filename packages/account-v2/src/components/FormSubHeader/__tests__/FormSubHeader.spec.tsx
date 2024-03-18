import React from 'react';
import { render, screen } from '@testing-library/react';
import { FormSubHeader } from '../FormSubHeader';

describe('FormSubHeader', () => {
    it('should render FormSubHeader', () => {
        const children = 'Test Details';
        render(<FormSubHeader>{children}</FormSubHeader>);
        expect(screen.getByText('Test Details')).toBeInTheDocument();
    });
});
