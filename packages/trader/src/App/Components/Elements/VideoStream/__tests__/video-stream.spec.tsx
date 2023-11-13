import React from 'react';
import { render, screen } from '@testing-library/react';
import VideoStream from '../video-stream';
import { getDescriptionVideoId } from 'Modules/Trading/Helpers/contract-type';

const mocked_props = {
    autoplay: true,
    height: 270,
    preload: 'auto',
    src: getDescriptionVideoId('vanilla', false),
};

describe('VideoStream component', () => {
    it('should have "positions-toggle--active" class when "is_open" is "true"', () => {
        render(<VideoStream {...mocked_props} />);
    });

    // it('should have "positions-toggle--has-count" class when "positions_count > 0"', () => {
    //     render(<VideoStream {...mocked_props} controls />);
    // });

    // it('should call "togglePositions" when the user clicked on the link', () => {
    //     const mockTogglePositions = jest.fn();
    //     render(<VideoStream {...mocked_props} disable_picture_in_picture />);
    // });

    // it('should render "IcPortfolio" icon', () => {
    //     render(<VideoStream {...mocked_props} loop />);
    // });
});
