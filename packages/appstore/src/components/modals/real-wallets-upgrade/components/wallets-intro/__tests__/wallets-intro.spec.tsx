import React from 'react';
import WalletsImage from 'Assets/svgs/wallets';
import { WalletsIntroComponent } from '../wallets-intro';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';

let mock = mockStore({});

const mocked_props = {
    image: <WalletsImage image='how_it_works' />,
    title: 'Upgrade To Wallets',
    description: 'A better way to manage your funds',
    bullets: ['Bullet 1', 'Bullet 2', 'Bullet 3'],
};

const checkContainerWalletsIntroComponent = () => {
    const wrapper = ({ children }: { children: JSX.Element }) => <StoreProvider store={mock}>{children}</StoreProvider>;

    const { container } = render(<WalletsIntroComponent {...mocked_props} />, {
        wrapper,
    });
    expect(container).toBeInTheDocument();
};

describe('WalletsIntroComponent', () => {
    beforeEach(() => {
        mock = mockStore({});
    });
    it('should render Wallet Intro Component', () => {
        checkContainerWalletsIntroComponent();
    });

    it('should render icon', () => {
        checkContainerWalletsIntroComponent();
        expect(screen.queryByTestId('dt_how_it_works')).toBeInTheDocument();
    });

    it('should render title, description and bullets', () => {
        checkContainerWalletsIntroComponent();
        expect(screen.getByText(mocked_props.title)).toBeInTheDocument();
        expect(screen.getByText(mocked_props.description)).toBeInTheDocument();
        mocked_props.bullets.forEach(bullet => {
            expect(screen.getByText(bullet)).toBeInTheDocument();
        });
    });
});
