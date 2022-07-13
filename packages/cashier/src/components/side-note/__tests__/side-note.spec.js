import React from 'react';
import { render, screen } from '@testing-library/react';
import SideNote from '../side-note';

describe('<SideNote />', () => {
    const props = {
        has_bullets: false,
        notes: ['First side note message', 'Second side note message'],
        title: 'Side note title',
    };

    it('should show proper title and messages', () => {
        render(<SideNote {...props} />);

        expect(screen.getByText('First side note message')).toBeInTheDocument();
        expect(screen.getByText('Second side note message')).toBeInTheDocument();
        expect(screen.getByText('Side note title')).toBeInTheDocument();
    });

    it('should show side note bullet dots when "has_bullets=true"', () => {
        const { container } = render(<SideNote {...props} has_bullets />);

        expect(container.querySelector('.side-note__bullet-wrapper')).not.toBeNull();
        expect(container.querySelector('.side-note__bullet')).not.toBeNull();
    });
});
