import React from 'react';
import { render } from '@testing-library/react';
import { mockStore, StoreProvider } from '@deriv/stores';
import EmptyOnboarding from '../empty-onboarding';

describe('EmptyOnboarding test cases:', () => {
    it('Should render component', () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<EmptyOnboarding />, {
            wrapper,
        });

        expect(container).toBeInTheDocument();
    });
});
