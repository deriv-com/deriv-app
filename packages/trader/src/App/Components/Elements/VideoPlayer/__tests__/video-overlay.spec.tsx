import React from 'react';
import { render, screen } from '@testing-library/react';
import VideoOverlay from '../video-overlay';

const mocked_props = {
    onClick: jest.fn(),
};

const icon_testid = 'dt_player_overlay_icon';

describe('<VideoOverlay />', () => {
    it('should render the component', () => {
        const { container } = render(<VideoOverlay {...mocked_props} />);

        expect(container).not.toBeEmptyDOMElement();
    });

    it('should pass correct size to icon for desktop', () => {
        render(<VideoOverlay {...mocked_props} />);

        expect(screen.getByTestId(icon_testid)).toHaveAttribute('height', '128');
    });

    it('should pass correct size to icon for mobile', () => {
        render(<VideoOverlay {...mocked_props} is_mobile />);

        expect(screen.getByTestId(icon_testid)).toHaveAttribute('height', '88');
    });
});
