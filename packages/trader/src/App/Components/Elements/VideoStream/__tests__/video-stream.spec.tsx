import React from 'react';
import { render, screen } from '@testing-library/react';
import VideoStream from '../video-stream';
import { getDescriptionVideoId } from 'Modules/Trading/Helpers/video-config';

const video_stream_testid = 'dt_video_stream';

const mocked_props = {
    height: 270,
    preload: 'auto',
    src: getDescriptionVideoId('vanilla', false),
    test_id: video_stream_testid,
};

describe('VideoStream component', () => {
    it('should render iframe with a video with no controls & enabled picture-in-picture by default', () => {
        render(<VideoStream {...mocked_props} />);
        const iframe = screen.getByTestId(video_stream_testid);
        const iframe_src = iframe.getAttribute('src');
        const picture_in_picture_param = iframe
            .getAttribute('allow')
            ?.split(';')
            ?.find(param => param.includes('picture-in-picture'));
        expect(picture_in_picture_param?.includes('*')).toBeTruthy();
        expect(iframe_src?.includes('letterboxColor=transparent&preload=auto&controls=false')).toBeTruthy();
    });
    it('should render iframe with a video with controls', () => {
        render(<VideoStream {...mocked_props} controls />);
        const iframe_src = screen.getByTestId(video_stream_testid).getAttribute('src');
        // controls are shown when controls param is skipped from query string in the iframe src:
        expect(iframe_src?.includes('controls')).toBeFalsy();
    });
    it('should render iframe with a video with disabled picture-in-picture', () => {
        render(<VideoStream {...mocked_props} disable_picture_in_picture />);
        const picture_in_picture_param = screen
            .getByTestId(video_stream_testid)
            .getAttribute('allow')
            ?.split(';')
            ?.find(param => param.includes('picture-in-picture'));
        expect(picture_in_picture_param?.includes('none')).toBeTruthy();
    });
    it('should render iframe with a looped video', () => {
        render(<VideoStream {...mocked_props} loop />);
        const iframe_src = screen.getByTestId(video_stream_testid).getAttribute('src');
        expect(iframe_src?.includes('loop=true')).toBeTruthy();
    });
    it('should render iframe with an autoplaying video', () => {
        render(<VideoStream {...mocked_props} autoplay />);
        const iframe_src = screen.getByTestId(video_stream_testid).getAttribute('src');
        expect(iframe_src?.includes('autoplay=true')).toBeTruthy();
    });
    it('should render iframe with a video that starts playing from the specified start_time', () => {
        const start_time = '0h00m20s';
        render(<VideoStream {...mocked_props} start_time={start_time} />);
        const iframe_src = screen.getByTestId(video_stream_testid).getAttribute('src');
        expect(iframe_src?.includes(`startTime=${start_time}`)).toBeTruthy();
    });
    it('should render iframe with a muted video', () => {
        render(<VideoStream {...mocked_props} muted />);
        const iframe_src = screen.getByTestId(video_stream_testid).getAttribute('src');
        expect(iframe_src?.includes('muted=true')).toBeTruthy();
    });
    it('should render iframe with a video that has a poster, an ad, captions, and red primary color', () => {
        const poster_url = 'test.png';
        const ad_url = 'test.mp4';
        const captions_url = 'captions.vtt';
        const primary_color = 'red';
        render(
            <VideoStream
                {...mocked_props}
                poster={poster_url}
                ad_url={ad_url}
                default_text_track={captions_url}
                primary_color={primary_color}
            />
        );
        const iframe_src = screen.getByTestId(video_stream_testid).getAttribute('src');
        expect(
            iframe_src?.includes(
                `poster=${poster_url}&ad-url=${ad_url}&defaultTextTrack=${captions_url}&primaryColor=${primary_color}`
            )
        ).toBeTruthy();
    });
});
