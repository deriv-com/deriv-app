import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import VideoControls from '../video-controls';

const mocked_props: React.ComponentProps<typeof VideoControls> = {
    current_time: 3,
    dragStartHandler: jest.fn(),
    is_animated: true,
    is_ended: false,
    is_playing: true,
    onRewind: jest.fn(),
    onPlaybackRateChange: jest.fn(),
    progress_bar_filled_ref: { current: null },
    progress_bar_ref: { current: null },
    progress_dot_ref: { current: null },
    show_controls: true,
    togglePlay: jest.fn(),
    video_duration: 33,
    playback_rate: 1,
    onUserActivity: jest.fn(),
};

const playback_rate_control = 'PlaybackRateControl component';
const progress_bar = 'dt_progress_bar';
const progress_bar_filled = 'dt_progress_bar_filled';
const progress_bar_dot = 'dt_progress_bar_dot';

jest.mock('../playback-rate-control', () => jest.fn(() => <div>{playback_rate_control}</div>));

describe('<VideoControls />', () => {
    it('should render the component', () => {
        render(<VideoControls {...mocked_props} />);

        expect(screen.getByTestId(progress_bar)).toBeInTheDocument();
        expect(screen.getByTestId(progress_bar_filled)).toBeInTheDocument();
        expect(screen.getByText(/00:03 \/ 00:33/i)).toBeInTheDocument();
        expect(screen.getByText(playback_rate_control)).toBeInTheDocument();
    });

    it('should render drag dot on progress bar mouseover event and hide it on mouseleave event', () => {
        render(<VideoControls {...mocked_props} />);
        const progress = screen.getByTestId(progress_bar);

        expect(screen.queryByTestId(progress_bar_dot)).not.toBeInTheDocument();
        fireEvent.mouseOver(progress);
        expect(screen.getByTestId(progress_bar_dot)).toBeInTheDocument();

        fireEvent.mouseLeave(progress);
        expect(screen.queryByTestId(progress_bar_dot)).not.toBeInTheDocument();
    });

    it('should always render drag dot on mobile', () => {
        render(<VideoControls {...mocked_props} is_mobile />);

        expect(screen.getByTestId(progress_bar_dot)).toBeInTheDocument();
    });

    it('should apply specific className if is_mobile and has_enlarged_dot === true', () => {
        render(<VideoControls {...mocked_props} is_mobile has_enlarged_dot />);

        expect(screen.getByTestId(progress_bar_dot)).toHaveClass('player__progress-dot--enlarged');
    });

    it('should apply specific className if is_mobile and increased_drag_area === true', () => {
        render(<VideoControls {...mocked_props} is_mobile increased_drag_area />);

        expect(screen.getByTestId(progress_bar_dot)).toHaveClass('player__progress-dot--increased-drag-area');
    });
});
