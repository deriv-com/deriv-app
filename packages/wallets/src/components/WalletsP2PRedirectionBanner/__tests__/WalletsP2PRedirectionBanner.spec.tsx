import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { redirectToStandaloneP2P } from '../../../helpers/urls';
import useIsRtl from '../../../hooks/useIsRtl';
import WalletsP2PRedirectionBanner from '../WalletsP2PRedirectionBanner';

jest.mock('@deriv/quill-icons', () => ({
    CurrencyP2PIcon: () => <div data-testid='dt_currency_p2p_icon' />,
    LabelPairedChevronLeftCaptionRegularIcon: () => <div data-testid='dt_chevron_left_icon' />,
    LabelPairedChevronRightCaptionRegularIcon: () => <div data-testid='dt_chevron_right_icon' />,
}));

jest.mock('../../../helpers/urls', () => ({
    redirectToStandaloneP2P: jest.fn(),
}));

jest.mock('../../../hooks/useIsRtl', () => jest.fn());

describe('WalletsP2PRedirectionBanner', () => {
    beforeEach(() => {
        (useIsRtl as jest.Mock).mockReturnValue(false);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the banner with default elements', () => {
        render(<WalletsP2PRedirectionBanner />);

        expect(screen.getByTestId('dt_currency_p2p_icon')).toBeInTheDocument();
        expect(screen.getByText('Easily exchange USD with local currency using Deriv P2P.')).toBeInTheDocument();
        expect(screen.getByTestId('dt_chevron_right_icon')).toBeInTheDocument();
    });

    it('renders the chevron left icon in RTL mode', () => {
        (useIsRtl as jest.Mock).mockReturnValue(true);

        render(<WalletsP2PRedirectionBanner />);

        expect(screen.getByTestId('dt_chevron_left_icon')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_chevron_right_icon')).not.toBeInTheDocument();
    });

    it('calls redirectToStandaloneP2P on click', async () => {
        render(<WalletsP2PRedirectionBanner />);

        const banner = screen.getByTestId('dt_wallets_p2p_redirection_banner');
        await userEvent.click(banner);

        expect(redirectToStandaloneP2P).toHaveBeenCalledTimes(1);
    });

    it('calls redirectToStandaloneP2P on keydown', () => {
        render(<WalletsP2PRedirectionBanner />);

        const banner = screen.getByTestId('dt_wallets_p2p_redirection_banner');
        fireEvent.keyDown(banner);

        expect(redirectToStandaloneP2P).toHaveBeenCalledTimes(1);
    });
});
