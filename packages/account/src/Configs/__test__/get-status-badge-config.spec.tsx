import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import getStatusBadgeConfig from '../get-status-badge-config';
import { ACCOUNT_BADGE_STATUS, TAccountBadgeStatus } from '@deriv/shared';

describe('getStatusBadgeConfig', () => {
    let account_status: TAccountBadgeStatus;
    const onClickBanner = jest.fn();

    const renderCheck = (
        account_status: Parameters<typeof getStatusBadgeConfig>[0],
        onClickBanner: Parameters<typeof getStatusBadgeConfig>[1]
    ) => {
        const badge = getStatusBadgeConfig(account_status, onClickBanner);
        render(
            <BrowserRouter>
                <div>{badge.text}</div>
                <div>{badge.icon}</div>
            </BrowserRouter>
        );
    };

    it('should render pending status', () => {
        account_status = ACCOUNT_BADGE_STATUS.PENDING;

        renderCheck(account_status, onClickBanner);

        expect(screen.getByText('In review')).toBeInTheDocument();
        expect(screen.getByText('IcAlertWarning')).toBeInTheDocument();
    });

    it('should render failed status', () => {
        account_status = ACCOUNT_BADGE_STATUS.FAILED;

        renderCheck(account_status, onClickBanner);
        const failed_text = screen.getByText('Failed');

        expect(failed_text).toBeInTheDocument();
        expect(screen.getByText('IcRedWarning')).toBeInTheDocument();

        userEvent.click(failed_text);
        expect(onClickBanner).toBeCalled();
    });

    it('should render needs_verification status', () => {
        account_status = ACCOUNT_BADGE_STATUS.NEEDS_VERIFICATION;

        renderCheck(account_status, onClickBanner);
        const needs_verification_text = screen.getByText('Needs Verification');

        expect(needs_verification_text).toBeInTheDocument();
        expect(screen.getByText('IcMt5Verification'));

        userEvent.click(needs_verification_text);
        expect(onClickBanner).toBeCalled();
    });
});
