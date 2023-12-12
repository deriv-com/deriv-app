import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader from '../Loader';

describe('Loader', () => {
    it('should render Loader component with default props', () => {
        render(<Loader />);
        const loaderElement = screen.getByTestId('dt_wallets-loader');

        expect(loaderElement).toBeInTheDocument();
        expect(loaderElement).toHaveClass('wallets-loader');
        expect(loaderElement).toHaveClass('wallets-loader--fullscreen');
    });

    it('should render Loader component with custom props', () => {
        render(<Loader color='red' isFullScreen={false} />);
        const loaderElement = screen.getByTestId('dt_wallets-loader');
        const spanElement = screen.getByRole('span');

        expect(loaderElement).toBeInTheDocument();
        expect(loaderElement).toHaveClass('wallets-loader');
        expect(loaderElement).not.toHaveClass('wallets-loader--fullscreen');
        expect(spanElement).toHaveStyle('backgroundColor: red');
    });
});
