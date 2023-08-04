import React from 'react';
import { render, screen } from '@testing-library/react';
import Audio from '../audio';

describe('Audio', () => {
    it('should render Audio', () => {
        const { container } = render(<Audio />);
        expect(container).toBeInTheDocument();
    });

    it('should have 5 audio tag', () => {
        render(<Audio />);
        expect(screen.getAllByLabelText('audio')).toHaveLength(5);
    });
});
