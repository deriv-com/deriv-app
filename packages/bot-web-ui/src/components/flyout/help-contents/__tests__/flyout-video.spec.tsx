import React from 'react';
import { render, screen } from '@testing-library/react';
import FlyoutVideo from '../flyout-video';

describe('FlyoutVideo', () => {
    const sampleURL = 'https://www.example.com/sample-video';

    beforeEach(() => {
        render(<FlyoutVideo url={sampleURL} />);
    });

    it('Renders the iframe container', async () => {
        const iframeElementContainer = screen.getByTestId('dt_flyout_video_container');

        expect(iframeElementContainer).toBeInTheDocument();
    });

    it('Renders the iframe with the provided URL', async () => {
        const iframeElement = screen.getByTestId('dt_flyout_video');

        expect(iframeElement).toHaveAttribute('src', sampleURL);
    });

    it('Renders the iframe with the correct attributes', () => {
        const iframeElement = screen.getByTestId('dt_flyout_video');

        expect(iframeElement).toHaveAttribute('frameBorder', '0');
        expect(iframeElement).toHaveAttribute('allow', 'accelerometer; encrypted-media; gyroscope; picture-in-picture');
        expect(iframeElement).toHaveAttribute('allowFullScreen', '');
        expect(iframeElement).toHaveAttribute('width', '100%');
    });

    it('Renders the iframe with the correct class', () => {
        const iframeElement = screen.getByTestId('dt_flyout_video');

        expect(iframeElement).toHaveClass('flyout__video');
    });
});
