import React, { PropsWithChildren } from 'react';
import { APIProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import WalletsAuthProvider from '../../../../../AuthProvider';
import { PRODUCT } from '../../../constants';
import CompareAccountsCard from '../CompareAccountsCard';

const wrapper = ({ children }: PropsWithChildren) => (
    <APIProvider>
        <WalletsAuthProvider>{children}</WalletsAuthProvider>
    </APIProvider>
);

describe('CompareAccountsCard', () => {
    const defaultProps = {
        account: {
            platform: 'mt5',
            product: 'standard',
            product_details: {
                max_leverage: '1:1000',
                min_spread: '0.5',
            },
        },
        isDemo: false,
        isEuRegion: false,
    };

    it('renders the component with default props', () => {
        //@ts-expect-error we only need partial types
        render(<CompareAccountsCard {...defaultProps} />, { wrapper });

        expect(screen.getByText('MT5 Platform')).toBeInTheDocument();
        expect(screen.getByText('Standard')).toBeInTheDocument();
        expect(screen.getByText('Up to 1:1000')).toBeInTheDocument();
        expect(screen.getByText('Maximum leverage')).toBeInTheDocument();
        expect(screen.getByText('0.5 pips')).toBeInTheDocument();
        expect(screen.getByText('Spreads from')).toBeInTheDocument();
    });

    it('renders the new banner for Zero Spread and Gold platforms', () => {
        const { rerender } = render(
            <CompareAccountsCard
                {...defaultProps}
                //@ts-expect-error we only need partial types
                account={{ ...defaultProps.account, product: PRODUCT.ZEROSPREAD }}
            />,
            { wrapper }
        );

        expect(screen.getByText('NEW')).toBeInTheDocument();

        rerender(
            <CompareAccountsCard
                {...defaultProps}
                //@ts-expect-error we only need partial types
                account={{ ...defaultProps.account, product: PRODUCT.GOLD }}
            />
        );

        expect(screen.getByText('NEW')).toBeInTheDocument();
    });

    it('does not render the new banner for non Zero Spread platforms', () => {
        //@ts-expect-error we only need partial types
        render(<CompareAccountsCard {...defaultProps} />, { wrapper });

        expect(screen.queryByText('NEW')).not.toBeInTheDocument();
    });

    it('renders the EU clients disclaimer for EU users with financial product', () => {
        const modifiedDefaultProps = { ...defaultProps, account: { ...defaultProps.account, product: 'financial' } };
        //@ts-expect-error we only need partial types
        render(<CompareAccountsCard {...modifiedDefaultProps} isEuRegion />, { wrapper });

        expect(screen.getByText('*Boom 300 and Crash 300 Index')).toBeInTheDocument();
    });

    it('does not render the EU clients disclaimer for non-EU users', () => {
        //@ts-expect-error we only need partial types
        render(<CompareAccountsCard {...defaultProps} />, { wrapper });

        expect(screen.queryByText('*Boom 300 and Crash 300 Index')).not.toBeInTheDocument();
    });
});
