import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import getStatusBadgeConfig from 'Configs/get-status-badge-config';
import { MT5_ACCOUNT_STATUS } from '@deriv/shared';

describe('getStatusBadgeConfig', () => {
    let account_status = '';
    const openFailedVerificationModal = jest.fn();
    const setIsVerificationModalVisible = jest.fn();
    const selected_account_type = 'test type';

    const renderCheck = (
        account_status: Parameters<typeof getStatusBadgeConfig>[0],
        openFailedVerificationModal: Parameters<typeof getStatusBadgeConfig>[1],
        selected_account_type: Parameters<typeof getStatusBadgeConfig>[2],
        setIsVerificationModalVisible?: Parameters<typeof getStatusBadgeConfig>[3]
    ) => {
        const badge = getStatusBadgeConfig(
            account_status,
            openFailedVerificationModal,
            selected_account_type,
            setIsVerificationModalVisible
        );
        render(
            <BrowserRouter>
                <div>{badge.text}</div>
                <div>{badge.icon}</div>
            </BrowserRouter>
        );
    };

    it('should render pending status', () => {
        account_status = MT5_ACCOUNT_STATUS.PENDING;

        renderCheck(account_status, openFailedVerificationModal, selected_account_type);

        expect(screen.getByText('Pending verification')).toBeInTheDocument();
        expect(screen.getByText('IcAlertWarning')).toBeInTheDocument();
    });

    it('should render failed status and trigger "Why?"', () => {
        account_status = MT5_ACCOUNT_STATUS.FAILED;

        renderCheck(account_status, openFailedVerificationModal, selected_account_type);

        expect(screen.getByText('Verification failed.')).toBeInTheDocument();
        expect(screen.getByText('IcRedWarning')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Why?'));
        expect(openFailedVerificationModal).toBeCalledWith(selected_account_type);
    });

    it('should render needs_verification status and redirect to identity', () => {
        account_status = MT5_ACCOUNT_STATUS.NEEDS_VERIFICATION;

        renderCheck(account_status, openFailedVerificationModal, selected_account_type, setIsVerificationModalVisible);

        expect(screen.getByText(/Needs verification./));
        expect(screen.getByText('IcAlertInfo'));

        const btn = screen.getByText('Verify now');
        expect(btn).toBeInTheDocument();
        userEvent.click(btn);
        expect(setIsVerificationModalVisible).toBeCalled();
    });

    it('should render migrated_with_position status', () => {
        account_status = 'migrated_with_position';

        renderCheck(account_status, openFailedVerificationModal, selected_account_type);

        expect(screen.getByText('No new positions')).toBeInTheDocument();
        expect(screen.getByText('IcAlertWarning')).toBeInTheDocument();
    });

    it('should render migrated_without_position status', () => {
        account_status = 'migrated_without_position';

        renderCheck(account_status, openFailedVerificationModal, selected_account_type);

        expect(screen.getByText('Account closed')).toBeInTheDocument();
        expect(screen.getByText('IcAlertWarning')).toBeInTheDocument();
    });
});
