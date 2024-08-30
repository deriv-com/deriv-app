import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { SameDOBPhoneModalContent } from '../same-dob-phone-modal-content';

describe('<SameDOBPhoneModalContent />', () => {
    const mockDefault = mockStore({});

    const wrapper = (mock: ReturnType<typeof mockStore> = mockDefault) => {
        const Component = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        return Component;
    };

    it('should render modal content with correct title', () => {
        render(<SameDOBPhoneModalContent />, {
            wrapper: wrapper(),
        });

        expect(screen.getByText(/Account already exists/)).toBeInTheDocument();
    });
});
