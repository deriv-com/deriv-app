import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import getStatusBadgeConfig from 'Configs/get-status-badge-config';
import { AUTH_STATUS_CODES, MT5_ACCOUNT_STATUS, routes } from '@deriv/shared';
import { TMT5AccountStatus } from 'Types';

describe('getStatusBadgeConfig', () => {
    let account_status: TMT5AccountStatus;
    const openFailedVerificationModal = jest.fn();
    const setIsVerificationModalVisible = jest.fn();
    const selected_account_type = {};

    const renderCheck = (
        account_status: Parameters<typeof getStatusBadgeConfig>[0],
        openFailedVerificationModal: Parameters<typeof getStatusBadgeConfig>[1],
        selected_account_type: Parameters<typeof getStatusBadgeConfig>[2],
        setIsVerificationModalVisible?: Parameters<typeof getStatusBadgeConfig>[3],
        user_account_status?: Parameters<typeof getStatusBadgeConfig>[4]
    ) => {
        const badge = getStatusBadgeConfig(
            account_status,
            openFailedVerificationModal,
            selected_account_type,
            setIsVerificationModalVisible,
            user_account_status
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

    it('should render needs_verification status and redirect to identity by default', () => {
        account_status = MT5_ACCOUNT_STATUS.NEEDS_VERIFICATION;

        renderCheck(account_status, openFailedVerificationModal, selected_account_type, setIsVerificationModalVisible);

        expect(screen.getByText(/Needs verification./));
        expect(screen.getByText('IcAlertInfo'));

        const btn = screen.getByText('Verify now');
        expect(btn).toBeInTheDocument();
        expect(btn.hasAttribute('href'));
        expect(btn.hasAttribute(routes.proof_of_identity));
        userEvent.click(btn);
        expect(setIsVerificationModalVisible).toBeCalled();
    });

    it('should render migrated_with_position status', () => {
        account_status = MT5_ACCOUNT_STATUS.MIGRATED_WITH_POSITION;

        renderCheck(account_status, openFailedVerificationModal, selected_account_type);

        expect(screen.getByText('No new positions')).toBeInTheDocument();
        expect(screen.getByText('IcAlertWarning')).toBeInTheDocument();
    });

    it('should render migrated_without_position status', () => {
        account_status = MT5_ACCOUNT_STATUS.MIGRATED_WITHOUT_POSITION;

        renderCheck(account_status, openFailedVerificationModal, selected_account_type);

        expect(screen.getByText('Account closed')).toBeInTheDocument();
        expect(screen.getByText('IcAlertWarning')).toBeInTheDocument();
    });

    it('should render need_verification status and redirect to POA when POI is verified', () => {
        account_status = MT5_ACCOUNT_STATUS.NEEDS_VERIFICATION;

        renderCheck(account_status, openFailedVerificationModal, selected_account_type, undefined, {
            poi_status: AUTH_STATUS_CODES.VERIFIED,
            poa_status: AUTH_STATUS_CODES.NONE,
        });

        expect(screen.getByText('Needs verification.'));
        expect(screen.getByText('IcAlertInfo'));

        const btn = screen.getByRole('link', { name: 'Verify now' });
        expect(btn).toBeInTheDocument();
        expect(btn.hasAttribute('href'));
        expect(btn.hasAttribute(routes.proof_of_address));
    });

    it('should render need_verification status and redirect to POI when POI status is not verified and POA status is not verified', () => {
        account_status = MT5_ACCOUNT_STATUS.NEEDS_VERIFICATION;

        renderCheck(account_status, openFailedVerificationModal, selected_account_type, undefined, {
            poi_status: AUTH_STATUS_CODES.NONE,
            poa_status: AUTH_STATUS_CODES.NONE,
        });

        expect(screen.getByText('Needs verification.'));
        expect(screen.getByText('IcAlertInfo'));

        const btn = screen.getByRole('link', { name: 'Verify now' });

        expect(btn).toBeInTheDocument();
        expect(btn.hasAttribute('href'));
        expect(btn.hasAttribute(routes.proof_of_identity));
    });
});
