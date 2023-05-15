import React from 'react';
import WalletsImage from 'Assets/svgs/wallets';
import { WalletsIntroComponent } from '../wallets-intro';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';

let mock = mockStore({});

const image = <WalletsImage image='how_it_works' />;
const title = 'Upgrade To Wallets';
const description = 'Dont be broke';
const bullets = ['Bullet 1', 'Bullet 2', 'Bullet 3'];

const checkContainerWalletsIntroComponent = () => {
    const wrapper = ({ children }: { children: JSX.Element }) => <StoreProvider store={mock}>{children}</StoreProvider>;

    const { container } = render(
        <WalletsIntroComponent image={image} title={title} description={description} bullets={bullets} />,
        {
            wrapper,
        }
    );
    expect(container).toBeInTheDocument();
};

describe('WalletsIntroComponent', () => {
    beforeEach(() => {
        mock = mockStore({});
    });
    it('should render', () => {
        checkContainerWalletsIntroComponent();
    });

    it('should render icon', () => {
        checkContainerWalletsIntroComponent();
        expect(screen.queryByTestId('dt_how_it_works')).toBeInTheDocument();
    });

    it('should render title, description and bullets', () => {
        checkContainerWalletsIntroComponent();
        expect(screen.getByText(title)).toBeInTheDocument();
        expect(screen.getByText(description)).toBeInTheDocument();
        bullets.forEach(bullet => {
            expect(screen.getByText(bullet)).toBeInTheDocument();
        });
    });
});
