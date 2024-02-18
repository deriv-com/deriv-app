import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PlaybackRateControl from '../playback-rate-control';

const mocked_props = {
    onPlaybackRateChange: jest.fn(),
    playback_rate: 1,
};

const default_selected_item = 'Normal';
const playback_rate_list = ['0.25x', '0.5x', '0.75x', default_selected_item, '1.5x', '2.0x'];

describe('<PlaybackRateControl />', () => {
    it('should render the component', () => {
        const { container } = render(<PlaybackRateControl {...mocked_props} />);

        expect(container).not.toBeEmptyDOMElement();
    });

    it('should render all available options of playback rate if user clicked on default one', () => {
        render(<PlaybackRateControl {...mocked_props} />);

        playback_rate_list.forEach(item =>
            item === default_selected_item
                ? expect(screen.getByText(item)).toBeInTheDocument()
                : expect(screen.queryByText(item)).not.toBeInTheDocument()
        );
        userEvent.click(screen.getByText(default_selected_item));

        playback_rate_list.forEach(item =>
            item === default_selected_item
                ? expect(screen.getAllByText(item)).toHaveLength(2)
                : expect(screen.getByText(item)).toBeInTheDocument()
        );
    });

    it('should call onPlaybackRateChange if user chooses another option', () => {
        render(<PlaybackRateControl {...mocked_props} />);

        expect(mocked_props.onPlaybackRateChange).not.toBeCalled();
        userEvent.click(screen.getByText(default_selected_item));
        userEvent.click(screen.getByText(playback_rate_list[0]));

        expect(mocked_props.onPlaybackRateChange).toBeCalled();
    });
});
