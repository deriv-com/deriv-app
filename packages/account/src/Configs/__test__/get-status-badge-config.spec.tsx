import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import getStatusBadgeConfig from 'Configs/get-status-badge-config';

describe('getStatusBadgeConfig', () => {
    let account_status = '';
    const openFailedVerificationModal = jest.fn();
    const selected_account_type = 'test type';

    const renderCheck = (
        account_status: Parameters<typeof getStatusBadgeConfig>[0],
        openFailedVerificationModal: Parameters<typeof getStatusBadgeConfig>[1],
        selected_account_type: Parameters<typeof getStatusBadgeConfig>[2]
    ) => {
        const badge = getStatusBadgeConfig(account_status, openFailedVerificationModal, selected_account_type);
        render(
            <BrowserRouter>
                <div>{badge.text}</div>
                <div>{badge.icon}</div>
            </BrowserRouter>
        );
    };

    it('should render pending status', () => {
        account_status = 'pending';

        renderCheck(account_status, openFailedVerificationModal, selected_account_type);

        expect(screen.getByText('Pending verification')).toBeInTheDocument();
        expect(screen.getByText('IcAlertWarning')).toBeInTheDocument();
    });

    it('should render failed status and trigger "Why?"', () => {
        account_status = 'failed';

        renderCheck(account_status, openFailedVerificationModal, selected_account_type);

        expect(screen.getByText('Verification failed.')).toBeInTheDocument();
        expect(screen.getByText('IcRedWarning')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Why?'));
        expect(openFailedVerificationModal).toBeCalledWith(selected_account_type);
    });

    it('should render need_verification status and redirect to identity', () => {
        account_status = 'need_verification';

        renderCheck(account_status, openFailedVerificationModal, selected_account_type);

        expect(screen.getByText('Need verification.'));
        expect(screen.getByText('IcAlertInfo'));

        const btn = screen.getByRole('link', { name: 'Verify now' });
        expect(btn).toBeInTheDocument();
        expect(btn.hasAttribute('href'));
        expect(btn.hasAttribute('/account/proof-of-identity'));
    });
});
