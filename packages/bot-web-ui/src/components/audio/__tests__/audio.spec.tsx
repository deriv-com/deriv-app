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

    it('should have mandatory src attribute in audio tags', () => {
        render(<Audio />);

        const audio_announcement = screen.getByLabelText('audio', { selector: '#announcement' });
        const audio_earned_money = screen.getByLabelText('audio', { selector: '#earned-money' });
        const audio_job_done = screen.getByLabelText('audio', { selector: '#job-done' });
        const audio_error = screen.getByLabelText('audio', { selector: '#error' });
        const audio_severe_error = screen.getByLabelText('audio', { selector: '#severe-error' });

        expect(audio_announcement).toHaveAttribute('src', '/media/announcement.mp3');
        expect(audio_earned_money).toHaveAttribute('src', '/media/coins.mp3');
        expect(audio_job_done).toHaveAttribute('src', '/media/job-done.mp3');
        expect(audio_error).toHaveAttribute('src', '/media/out-of-bounds.mp3');
        expect(audio_severe_error).toHaveAttribute('src', '/media/i-am-being-serious.mp3');
    });
});
