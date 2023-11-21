import React from 'react';
import { render, screen } from '@testing-library/react';
import WalletResponsiveSvg from '../WalletResponsiveSvg';

describe('<WalletResponsiveSvg/>', () => {
    it('render container and svg properly', () => {
        render(<WalletResponsiveSvg icon='IcWalletOptionsLight' />);

        const divElement = screen.getByTestId('dt_wallet_icon');

        // eslint-disable-next-line testing-library/no-node-access
        const mockedSvgElement = divElement.querySelector('file-mock-stub');
        expect(divElement).toBeInTheDocument();
        expect(mockedSvgElement).not.toBeNull();
    });

    it('renders svg in responsive manner', () => {
        render(<WalletResponsiveSvg icon='IcWalletOptionsLight' />);

        const divElement = screen.getByTestId('dt_wallet_icon');

        // eslint-disable-next-line testing-library/no-node-access
        const mockedSvgElement = divElement.querySelector('file-mock-stub');

        expect(mockedSvgElement).toHaveAttribute('preserveAspectRatio');
    });

    it('renders nothing when there is no svg provided', () => {
        const { container } = render(<WalletResponsiveSvg icon='' />);

        expect(container).toBeEmptyDOMElement();
    });
});
