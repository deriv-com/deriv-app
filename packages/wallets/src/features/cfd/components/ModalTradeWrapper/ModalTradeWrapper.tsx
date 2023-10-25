import React, { FC, PropsWithChildren } from 'react';
import { ModalStepWrapper } from '../../../../components/Base/ModalStepWrapper';
import InstallationAppleIcon from '../../../../public/images/ic-installation-apple.svg';
import InstallationGoogleIcon from '../../../../public/images/ic-installation-google.svg';
import InstallationHuaweiIcon from '../../../../public/images/ic-installation-huawei.svg';
import './ModalTradeWrapper.scss';
import { WalletText } from '../../../../components/Base';
import QRCode from 'qrcode.react';
import useDevice from '../../../../hooks/useDevice';

type TModalTradeWrapperProps = {};

const ModalTradeWrapper: FC<PropsWithChildren<TModalTradeWrapperProps>> = ({ children }) => {
    const { isDesktop, isMobile } = useDevice();

    return (
        <ModalStepWrapper
            title='Trade'
            shouldFixedFooter={isDesktop}
            renderFooter={() => {
                return (
                    <div className='wallets-modal-trade-wrapper__footer'>
                        <WalletText align='center' size='sm' weight='bold'>
                            Download Deriv MT5 on your phone to trade with the Deriv MT5 account
                        </WalletText>
                        <div className='wallets-modal-trade-wrapper__footer-installations'>
                            <div className='wallets-modal-trade-wrapper__footer-installations-icons'>
                                <InstallationAppleIcon />
                                <InstallationGoogleIcon />
                                <InstallationHuaweiIcon />
                            </div>
                            {isDesktop && (
                                <div className='wallets-modal-trade-wrapper__footer-installations-qr'>
                                    <WalletText align='center' size='sm'>
                                        Scan the QR code to download Deriv MT5
                                    </WalletText>
                                </div>
                            )}
                        </div>
                    </div>
                );
            }}
        >
            {children}
        </ModalStepWrapper>
    );
};

export default ModalTradeWrapper;
