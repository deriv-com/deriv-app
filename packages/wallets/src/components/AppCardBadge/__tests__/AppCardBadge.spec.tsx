/* eslint-disable react/display-name */
import React from 'react';
import { render, screen } from '@testing-library/react';
import AppCardBadge from '../AppCardBadge';

describe('AppCardBadge', () => {
    it('renders proper label', () => {
        const { rerender } = render(<AppCardBadge isDemo={false} />);

        expect(screen.getByText('Real')).toBeInTheDocument();

        rerender(<AppCardBadge isDemo />);

        expect(screen.getByText('Demo')).toBeInTheDocument();
    });
});
