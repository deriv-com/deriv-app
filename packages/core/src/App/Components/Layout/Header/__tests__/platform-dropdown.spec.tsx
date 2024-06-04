import React from 'react';
import ReactDOM from 'react-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PlatformDropdown, PlatformBox } from '../platform-dropdown';
import { StoreProvider, mockStore } from '@deriv/stores';

type TMockPlatformDropdown = {
    platform_config: {
        link_to?: string;
        href?: string;
        name: string;
        description: () => string;
    }[];
};

const store = mockStore();

const MockPlatformDropdown = ({ platform_config }: TMockPlatformDropdown) => {
    return (
        <BrowserRouter>
            <StoreProvider store={store}>
                <PlatformDropdown
                    platform_config={platform_config}
                    app_routing_history={[{ pathname: '' }]}
                    closeDrawer={jest.fn()}
                />
            </StoreProvider>
        </BrowserRouter>
    );
};

describe('PlatformBox component', () => {
    it('should render "icon" and "description"', () => {
        const platform = {
            icon: 'test',
            description: () => 'test description',
        };
        render(<PlatformBox platform={platform} />);
        const icon = screen.getByTestId('dt_platform_box_icon');
        const description = screen.getByText('test description');
        expect(icon).toBeInTheDocument();
        expect(description).toBeInTheDocument();
    });
});

describe('PlatformDropdown component', () => {
    beforeAll(() => (ReactDOM.createPortal = jest.fn(element => element)));
    afterEach(() => ReactDOM.createPortal.mockClear());

    it('should render proper component base on the "link_to" property', () => {
        const { rerender } = render(
            <MockPlatformDropdown
                platform_config={[
                    {
                        link_to: '/test',
                        name: 'DTrader',
                        description: () => 'test description',
                    },
                ]}
            />
        );
        expect(screen.getByTestId('dt_platform_dropdown')).toBeInTheDocument();

        rerender(
            <MockPlatformDropdown
                platform_config={[
                    {
                        href: '/test',
                        name: 'DTrader',
                        description: () => 'test description',
                    },
                ]}
            />
        );
        expect(screen.getByTestId('dt_platform_dropdown_link')).toBeInTheDocument();
    });
});
