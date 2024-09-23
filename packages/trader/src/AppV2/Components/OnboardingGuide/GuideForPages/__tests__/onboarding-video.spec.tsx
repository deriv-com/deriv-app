import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import OnboardingVideo from '../onboarding-video';

const dt_video = 'dt_onboarding_guide_video';
const dt_loader = 'square-skeleton';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getUrlBase: jest.fn(() => 'video_src.mp4'),
}));

describe('OnboardingVideo', () => {
    beforeAll(() => {
        Object.defineProperty(HTMLMediaElement.prototype, 'muted', {
            set: jest.fn(),
        });
    });

    it('should render loader and video if the data is not fully loaded', () => {
        render(<OnboardingVideo type='trade_page' />);

        expect(screen.getByTestId(dt_loader)).toBeInTheDocument();
        expect(screen.getByTestId(dt_video)).toBeInTheDocument();
    });

    it('should render only video tag if the data has already loaded', () => {
        render(<OnboardingVideo type='trade_page' />);

        const video = screen.getByTestId(dt_video);
        fireEvent.loadedData(video);

        expect(screen.queryByTestId(dt_loader)).not.toBeInTheDocument();
        expect(video).toBeInTheDocument();
    });

    it('should render only video tag if the data has already loaded', () => {
        render(<OnboardingVideo type='positions_page' />);

        const video = screen.getByTestId(dt_video);
        fireEvent.loadedData(video);

        expect(screen.queryByTestId(dt_loader)).not.toBeInTheDocument();
        expect(video).toBeInTheDocument();
    });
});
