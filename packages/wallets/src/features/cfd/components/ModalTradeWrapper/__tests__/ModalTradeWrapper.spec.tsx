import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModalTradeWrapper from '../ModalTradeWrapper';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(),
}));

jest.mock('qrcode.react', () => ({
    __esModule: true,
    default: () => <div data-testid='qr-code' />,
}));

jest.mock('../../../../../components/Base/ModalStepWrapper', () => ({
    ModalStepWrapper: ({
        children,
        renderFooter,
        title,
    }: {
        children: React.ReactNode;
        renderFooter: () => React.ReactNode;
        title: string;
    }) => (
        <div>
            <h2>{title}</h2>
            {children}
            <div data-testid='dt_modal_footer'>{renderFooter()}</div>
        </div>
    ),
}));

jest.mock('../../../screens/MT5TradeScreen/MT5TradeLink/urlConfig', () => ({
    ...jest.requireActual('../../../screens/MT5TradeScreen/MT5TradeLink/urlConfig'),
    whiteLabelLinks: {
        huawei: 'https://mock.mt5.huawei.link',
    },
}));

describe('ModalTradeWrapper', () => {
    beforeEach(() => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
    });

    it('renders desktop content for modal trade wrapper', () => {
        render(
            <ModalTradeWrapper platform='mt5'>
                <div>Mocked Modal Content</div>
            </ModalTradeWrapper>
        );

        expect(screen.getByText('Mocked Modal Content')).toBeInTheDocument();
        expect(screen.getByText('Trade')).toBeInTheDocument();
        expect(screen.getByText(/Download Deriv MT5 on your phone/)).toBeInTheDocument();
        expect(screen.getByTestId('qr-code')).toBeInTheDocument();
        expect(screen.getByTestId('dt_modal_footer')).toBeInTheDocument();
    });

    it('renders mobile content for modal trade wrapper', () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });

        render(
            <ModalTradeWrapper platform='dxtrade'>
                <div>Mocked Modal Content</div>
            </ModalTradeWrapper>
        );

        expect(screen.getByText('Mocked Modal Content')).toBeInTheDocument();
        expect(screen.getByText('Trade')).toBeInTheDocument();
        expect(screen.getByTestId('dt_modal_footer')).toBeInTheDocument();
    });

    it('opens correct link when app icon is clicked', async () => {
        const mockOpen = jest.fn();
        window.open = mockOpen;

        render(
            <ModalTradeWrapper
                mt5Account={{
                    // @ts-expect-error - since this is a mock, we only need partial properties of the account
                    white_label_links: { android: 'https://mock.mt5.android.link', ios: 'https://mock.mt5.ios.link' },
                }}
                platform='mt5'
            />
        );

        const iosIcon = screen.getByTestId('dt_modal_trade_wrapper_ios_icon');
        const androidIcon = screen.getByTestId('dt_modal_trade_wrapper_android_icon');

        await userEvent.click(iosIcon);
        expect(mockOpen).toHaveBeenCalledWith('https://mock.mt5.ios.link');
        mockOpen.mockReset();

        await userEvent.click(androidIcon);
        expect(mockOpen).toHaveBeenCalledWith('https://mock.mt5.android.link');
        mockOpen.mockReset();
    });
});
