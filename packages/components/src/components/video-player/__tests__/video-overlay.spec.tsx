import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import VideoOverlay from '../video-overlay';

jest.mock('@deriv/quill-icons', () => ({
    ...jest.requireActual('@deriv/quill-icons'),
    StandalonePauseFillIcon: () => 'StandalonePauseFillIcon',
    StandalonePlayFillIcon: () => 'StandalonePlayFillIcon',
    StandaloneXmarkRegularIcon: () => 'StandaloneXmarkRegularIcon',
}));

describe('VideoOverlay', () => {
    const mockProps = {
        onClick: jest.fn(),
        togglePlay: jest.fn(),
        show_controls: false,
        is_ended: false,
        is_mobile: false,
        is_v2: false,
        is_playing: false,
        onModalClose: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should handle play/pause state correctly', () => {
        render(<VideoOverlay {...mockProps} is_v2={true} is_playing={true} />);
        expect(screen.getByText('StandalonePauseFillIcon')).toBeInTheDocument();

        render(<VideoOverlay {...mockProps} is_v2={true} is_playing={false} />);
        expect(screen.getByText('StandalonePlayFillIcon')).toBeInTheDocument();
    });

    it('should handle modal close', () => {
        render(<VideoOverlay {...mockProps} is_v2={true} />);
        fireEvent.click(screen.getByText('StandaloneXmarkRegularIcon'));
        expect(mockProps.onModalClose).toHaveBeenCalled();
    });

    it('should not show play/pause icons when video has ended', () => {
        render(<VideoOverlay {...mockProps} is_v2={true} is_ended={true} />);
        expect(screen.queryByText('StandalonePlayFillIcon')).not.toBeInTheDocument();
        expect(screen.queryByText('StandalonePauseFillIcon')).not.toBeInTheDocument();
    });

    it('should handle replay icon click when video has ended', () => {
        render(<VideoOverlay {...mockProps} is_ended={true} />);
        const replayIcon = screen.getByTestId('dt_player_overlay_icon');

        fireEvent.click(replayIcon);
        expect(mockProps.togglePlay).toHaveBeenCalled();
    });

    it('should handle replay icon click in mobile view', () => {
        render(<VideoOverlay {...mockProps} is_ended={true} is_mobile={true} />);
        const replayIcon = screen.getByTestId('dt_player_overlay_icon');

        fireEvent.click(replayIcon);
        expect(mockProps.togglePlay).toHaveBeenCalled();
    });
});
