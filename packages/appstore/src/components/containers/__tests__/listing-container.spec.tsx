import React from 'react';
import { render, screen } from '@testing-library/react';
import ListingContainer from '../listing-container';
import { StoreProvider, mockStore } from '@deriv/stores';

jest.mock('Components/pre-loader/title-card-loader', () => jest.fn(() => <span>TitleCardLoader</span>));
jest.mock('Components/currency-switcher-card', () => jest.fn(() => <span>CurrencySwitcherCard</span>));
jest.mock('Components/containers/grid-container', () => jest.fn(({ children }) => <>{children}</>));

const Title = () => <span>Test Title</span>;
const Description = () => <span>Test Description</span>;

let mock = mockStore({});

describe('ListingContainer', () => {
    const wrapper = ({ children }: { children: JSX.Element }) => <StoreProvider store={mock}>{children}</StoreProvider>;

    it('should render title and description when landing company is loaded', () => {
        mock = mockStore({
            client: {
                is_landing_company_loaded: true,
            },
        });

        render(
            <ListingContainer title={<Title />} description={<Description />} is_deriv_platform={false}>
                <div>Test Child</div>
            </ListingContainer>,
            {
                wrapper,
            }
        );

        const title = screen.queryByText('Test Title');
        const description = screen.queryByText('Test Description');
        expect(title).toBeInTheDocument();
        expect(description).toBeInTheDocument();
    });

    it('should render title and description when landing company is not loaded and is not deriv platform', () => {
        mock = mockStore({
            client: {
                is_landing_company_loaded: false,
            },
        });

        render(
            <ListingContainer title={<Title />} description={<Description />} is_deriv_platform={false}>
                <div>Test Child</div>
            </ListingContainer>,
            {
                wrapper,
            }
        );

        const title = screen.queryByText('Test Title');
        const description = screen.queryByText('Test Description');
        expect(title).toBeInTheDocument();
        expect(description).toBeInTheDocument();
    });

    it('should render TitleCardLoader when landing company is not loaded and is_deriv_platform is true', () => {
        mock = mockStore({
            client: {
                is_landing_company_loaded: false,
            },
        });

        render(
            <ListingContainer title={<Title />} description={<Description />} is_deriv_platform={true}>
                <div>Test Child</div>
            </ListingContainer>,
            {
                wrapper,
            }
        );

        const titleLoader = screen.queryByText('TitleCardLoader');
        expect(titleLoader).toBeInTheDocument();
    });

    it('should render CurrencySwitcherCard when is_deriv_platform is true', () => {
        render(
            <ListingContainer title={<Title />} description={<Description />} is_deriv_platform={true}>
                <div>Test Child</div>
            </ListingContainer>,
            {
                wrapper,
            }
        );

        const currencySwitcher = screen.queryByText('CurrencySwitcherCard');
        expect(currencySwitcher).toBeInTheDocument();
    });

    it('should render children inside GridContainer', () => {
        render(
            <ListingContainer title={<Title />} description={<Description />}>
                <div>Test Child</div>
            </ListingContainer>,
            {
                wrapper,
            }
        );

        const child = screen.queryByText('Test Child');
        expect(child).toBeInTheDocument();
    });
});
