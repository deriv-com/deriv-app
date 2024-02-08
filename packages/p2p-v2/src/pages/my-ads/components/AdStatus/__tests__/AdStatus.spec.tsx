import React from 'react';
import { render, screen } from '@testing-library/react';
import AdStatus from '../AdStatus';

describe('AdStatus', () => {
    it('should render the component as expected with Inactive as default', () => {
        render(<AdStatus />);
        expect(screen.getByText('Inactive')).toBeInTheDocument();
    });
    it('should render active when isActive is true', () => {
        render(<AdStatus isActive={true} />);
        expect(screen.getByText('Active')).toBeInTheDocument();
    });
});
