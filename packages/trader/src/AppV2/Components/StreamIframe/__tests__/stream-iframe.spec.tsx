import React from 'react';
import { render, screen } from '@testing-library/react';
import { UNIFIED_MODE_VIDEO_ID } from 'Modules/Trading/Helpers/video-config';
import StreamIframe from '../stream-iframe';

const video_stream_testid = 'dt_video_stream';

const mocked_props = {
    src: UNIFIED_MODE_VIDEO_ID.accumulator_stats,
    test_id: video_stream_testid,
    title: 'accumulator_stats',
};

describe('StreamIframe component', () => {
    it('should render iframe with a video with no controls & autoplay & looped & muted & preloaded & letterbox_color === transparent & width and height === 100% by default', () => {
        render(<StreamIframe {...mocked_props} />);
        const iframe = screen.getByTestId(video_stream_testid);
        const iframe_src = iframe.getAttribute('src');

        expect(
            iframe_src?.includes(
                'letterboxColor=transparent&muted=true&preload=auto&loop=true&autoplay=true&controls=false'
            )
        ).toBeTruthy();
        expect(iframe).toHaveAttribute('width', '100%');
        expect(iframe).toHaveAttribute('height', '100%');
    });

    it('should render iframe with a video with controls if a proper prop was passed', () => {
        render(<StreamIframe {...mocked_props} controls />);
        const iframe_src = screen.getByTestId(video_stream_testid).getAttribute('src');

        expect(iframe_src?.includes('controls=true')).toBeTruthy();
    });

    it('should render iframe with a non-looped video if a proper prop was passed', () => {
        render(<StreamIframe {...mocked_props} loop={false} />);
        const iframe_src = screen.getByTestId(video_stream_testid).getAttribute('src');

        expect(iframe_src?.includes('loop=false')).toBeTruthy();
    });

    it('should render iframe with a non-autoplaying video if a proper prop was passed', () => {
        render(<StreamIframe {...mocked_props} autoplay={false} />);
        const iframe_src = screen.getByTestId(video_stream_testid).getAttribute('src');

        expect(iframe_src?.includes('autoplay=false')).toBeTruthy();
    });

    it('should render iframe with a non-muted video if a proper prop was passed', () => {
        render(<StreamIframe {...mocked_props} muted={false} />);
        const iframe_src = screen.getByTestId(video_stream_testid).getAttribute('src');

        expect(iframe_src?.includes('muted=false')).toBeTruthy();
    });
});
