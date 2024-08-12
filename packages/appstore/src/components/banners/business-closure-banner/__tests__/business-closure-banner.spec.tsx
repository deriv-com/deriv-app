import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import BusinessClosureBanner from '../business-closure-banner';

describe('<BusinessClosureBanner />', () => {
    const mockDefault = mockStore({ client: { is_account_to_be_closed_by_residence: false } });

    const wrapper = (mock: ReturnType<typeof mockStore> = mockDefault) => {
        const Component = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        return Component;
    };

    it('should render nothing by default', () => {
        render(<BusinessClosureBanner />, {
            wrapper: wrapper(),
        });

        expect(screen.queryByText(/Due to business changes/)).not.toBeInTheDocument();
    });

    it('should render banner content if is_account_to_be_closed_by_residence === true ', () => {
        const mock = mockStore({ client: { is_account_to_be_closed_by_residence: true } });

        render(<BusinessClosureBanner />, {
            wrapper: wrapper(mock),
        });

        expect(screen.queryByText(/Due to business changes/)).toBeInTheDocument();
    });
});
