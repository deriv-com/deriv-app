import React from 'react';
import { render, screen } from '@testing-library/react';
import WalletBaseIcon from '../WalletBaseIcon';

describe('<WalletBaseIcon/>', () => {
    it('render container and svg properly', () => {
        render(<WalletBaseIcon icon='IcWalletOptionsLight' />);

        const divElement = screen.getByTestId('dt_wallet_icon');

        // eslint-disable-next-line testing-library/no-node-access
        const mockedSvgElement = divElement.querySelector('file-mock-stub');
        expect(divElement).toBeInTheDocument();
        expect(mockedSvgElement).not.toBeNull();
    });

    it('renders svg in responsive manner', () => {
        render(<WalletBaseIcon icon='IcWalletOptionsLight' />);

        const divElement = screen.getByTestId('dt_wallet_icon');

        // eslint-disable-next-line testing-library/no-node-access
        const mockedSvgElement = divElement.querySelector('file-mock-stub');

        expect(mockedSvgElement).toHaveAttribute('preserveAspectRatio');
    });
});
