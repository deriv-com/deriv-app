import React from 'react';
import { render, screen, within } from '@testing-library/react';
import FlyoutImage from '../flyout-img';

describe('FlyoutImage', () => {
    const mocked_props = {
        url: 'https://example.com/image.jpg',
        width: '100px',
    };

    beforeEach(() => {
        render(<FlyoutImage url={mocked_props.url} width={mocked_props.width} />);
    });

    it('Should render the FlyoutImage component', () => {
        const flyout_image = screen.getByTestId('dt_flyout_image');

        expect(flyout_image).toBeInTheDocument();
    });

    it('FlyoutImage component should consists the image', () => {
        const flyout_image = screen.getByTestId('dt_flyout_image');

        const img = within(flyout_image).getByRole('img');
        expect(img).toBeInTheDocument();
    });

    it('Renders the image with given url', () => {
        const flyout_image = screen.getByTestId('dt_flyout_image');
        const img = within(flyout_image).getByRole('img');

        expect(flyout_image).toBeInTheDocument();
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    it('Applies the width style when provided', () => {
        const flyout_image = screen.getByTestId('dt_flyout_image');

        const img = within(flyout_image).getByRole('img');
        expect(img).toHaveStyle({ width: '100px' });
    });

    it('Has the correct class names', () => {
        const flyout_image = screen.getByTestId('dt_flyout_image');
        const img = within(flyout_image).getByRole('img');

        expect(flyout_image).toHaveClass('flyout__item');
        expect(img).toHaveClass('flyout__image');
    });
});
