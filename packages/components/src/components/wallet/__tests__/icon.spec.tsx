import React from 'react';
import { render, screen } from '@testing-library/react';
import { WalletIcon } from '../icon';

jest.mock('../small/small.tsx', () => {
    const WalletSmall = () => <div>WalletSmall</div>;
    return WalletSmall;
});

describe('WalletIcon', () => {
    const mocked_props: React.ComponentProps<typeof WalletIcon> = {};

    it('Should render solo WalletIcon component', () => {
        const { rerender } = render(<WalletIcon account_icon='AccountIcon' wallet_icon='' />);

        expect(screen.getByText('WalletSmall')).toBeInTheDocument();

        rerender(<WalletIcon account_icon='' wallet_icon='WalletIcon' />);

        expect(screen.getByText('WalletSmall')).toBeInTheDocument();
    });

    it('Should render merged WalletIcon component', () => {
        render(<WalletIcon account_icon='AccountIcon' wallet_icon='WalletIcon' />);

        expect(screen.getAllByText('WalletSmall')).toHaveLength(2);
    });
});
