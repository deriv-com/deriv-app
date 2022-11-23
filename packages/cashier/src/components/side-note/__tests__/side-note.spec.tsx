import React from 'react';
import { render, screen } from '@testing-library/react';
import SideNote from '../side-note';

describe('<SideNote />', () => {
    const props = {
        has_bullets: false,
        side_notes: ['First side note message', 'Second side note message'],
        title: 'Side note title',
    };

    it('should show proper title and messages', () => {
        render(<SideNote {...props} />);

        expect(screen.getByText('First side note message')).toBeInTheDocument();
        expect(screen.getByText('Second side note message')).toBeInTheDocument();
        expect(screen.getByText('Side note title')).toBeInTheDocument();
    });

    it('should show side note bullet dots when "has_bullets=true"', () => {
        render(<SideNote {...props} has_bullets />);

        expect(screen.getByTestId('dt_side_note_bullet_wrapper_0')).toBeInTheDocument();
        expect(screen.getByTestId('dt_side_note_bullet_0')).toBeInTheDocument();
    });
});
