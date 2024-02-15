import React from 'react';
import EffortlessLoginContent from '../effortless-login-content';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';

describe('EffortlessLoginContent', () => {
    const modal_root_el = document.createElement('div');
    modal_root_el.setAttribute('id', 'modal_root_absolute');
    document.body.appendChild(modal_root_el);

    const mock_store = mockStore({});

    it('should render EffortlessLoginContent', () => {
        render(
            <StoreProvider store={mock_store}>
                <EffortlessLoginContent />
            </StoreProvider>
        );
        expect(screen.getByText(/Maybe later/)).toBeInTheDocument();
        expect(screen.getByText(/Effortless login with passkeys/)).toBeInTheDocument();
        expect(screen.getByText(/No need to remember a password/)).toBeInTheDocument();
        expect(screen.getByText(/Sync across devices/)).toBeInTheDocument();
        expect(screen.getByText(/Enhanced security with biometrics or screen lock/)).toBeInTheDocument();
        expect(screen.getByText(/Learn more about passkeys/)).toBeInTheDocument();
        expect(screen.getByText(/here/)).toBeInTheDocument();
        expect(screen.getByText(/Create passkey/)).toBeInTheDocument();
    });
});
