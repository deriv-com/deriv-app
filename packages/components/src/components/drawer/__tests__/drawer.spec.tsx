import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import Drawer from '../drawer';

describe('Drawer', () => {
    const mock_store = mockStore({});
    const renderComponent = (props: React.ComponentProps<typeof Drawer>) => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>{children}</StoreProvider>
        );

        render(<Drawer {...props} />, {
            wrapper,
        });
    };

    it('should Drawer be in the document', () => {
        renderComponent({ is_open: false });
        expect(screen.getByTestId('drawer')).toBeInTheDocument();
    });

    it('should Drawer be open if is_open="true" ', () => {
        renderComponent({ is_open: true });
        expect(screen.getByTestId('drawer')).toHaveClass('dc-drawer--open');
    });

    it('should Drawer be open if is_open="false" ', () => {
        renderComponent({ is_open: false });
        expect(screen.getByTestId('drawer')).not.toHaveClass('dc-drawer--open');
    });
});
