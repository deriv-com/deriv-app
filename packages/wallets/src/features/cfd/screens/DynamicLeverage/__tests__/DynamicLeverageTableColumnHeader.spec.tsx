import React from 'react';
import { render, screen } from '@testing-library/react';
import { DynamicLeverageTableColumnHeader } from '../DynamicLeverageTableColumnHeader';

describe('DynamicLeverageTableColumnHeader', () => {
    const mockProps = {
        subtitle: 'Test Subtitle',
        title: 'Test Title',
    };

    it('renders the title and subtitle correctly', () => {
        render(<DynamicLeverageTableColumnHeader {...mockProps} />);

        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    });
});
