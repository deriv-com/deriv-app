import React from 'react';
import {
    DerivLightWalletIcon,
    PaymentMethodAdvcashBrandDarkIcon,
    PaymentMethodAdvcashBrandIcon,
    PaymentMethodAstropayBrandDarkIcon,
    PaymentMethodAstropayBrandIcon,
    PaymentMethodBeyonicBrandIcon,
    PaymentMethodBoletoBrandIcon,
    PaymentMethodBoletoWhiteIcon,
    PaymentMethodJetonBrandIcon,
    PaymentMethodMastercardBrandDarkIcon,
    PaymentMethodMastercardBrandIcon,
    PaymentMethodNetellerBrandIcon,
    PaymentMethodNetellerWhiteIcon,
    PaymentMethodOnlinenairaBrandIcon,
    PaymentMethodPixBrandDarkIcon,
    PaymentMethodPixBrandIcon,
    PaymentMethodSkrillBrandIcon,
    PaymentMethodSkrillWhiteIcon,
    PaymentMethodSticpayBrandIcon,
    PaymentMethodVisaBrandIcon,
    PaymentMethodVisaWhiteIcon,
    PaymentMethodWebmoneyBrandIcon,
    PaymentMethodZingpayBrandDarkIcon,
    PaymentMethodZingpayBrandIcon,
} from '@deriv/quill-icons';
import { TPaymentMethod } from 'src/types';

type TPaymentMethodIconProps = { paymentMethod: TPaymentMethod; theme?: 'dark' | 'light' };

export const PaymentMethodIcon = ({ paymentMethod, theme }: TPaymentMethodIconProps) => {
    const iconSize = { height: 40, width: 64 };

    switch (paymentMethod) {
        case 'advcash': {
            return theme === 'dark' ? (
                <PaymentMethodAdvcashBrandDarkIcon {...iconSize} />
            ) : (
                <PaymentMethodAdvcashBrandIcon {...iconSize} />
            );
        }
        case 'astropay': {
            return theme === 'dark' ? (
                <PaymentMethodAstropayBrandDarkIcon {...iconSize} />
            ) : (
                <PaymentMethodAstropayBrandIcon {...iconSize} />
            );
        }
        case 'beyonic': {
            return <PaymentMethodBeyonicBrandIcon {...iconSize} />;
        }
        case 'boleto (d24 voucher)': {
            return theme === 'dark' ? (
                <PaymentMethodBoletoWhiteIcon {...iconSize} />
            ) : (
                <PaymentMethodBoletoBrandIcon {...iconSize} />
            );
        }
        case 'jeton': {
            return <PaymentMethodJetonBrandIcon {...iconSize} />;
        }
        case 'mastercard': {
            return theme === 'dark' ? (
                <PaymentMethodMastercardBrandDarkIcon {...iconSize} />
            ) : (
                <PaymentMethodMastercardBrandIcon {...iconSize} />
            );
        }
        case 'neteller': {
            return theme === 'dark' ? (
                <PaymentMethodNetellerWhiteIcon {...iconSize} />
            ) : (
                <PaymentMethodNetellerBrandIcon {...iconSize} />
            );
        }
        case 'onlinenaira': {
            return <PaymentMethodOnlinenairaBrandIcon {...iconSize} />;
        }
        case 'pix': {
            return theme === 'dark' ? (
                <PaymentMethodPixBrandDarkIcon {...iconSize} />
            ) : (
                <PaymentMethodPixBrandIcon {...iconSize} />
            );
        }
        case 'skrill': {
            return theme === 'dark' ? (
                <PaymentMethodSkrillWhiteIcon {...iconSize} />
            ) : (
                <PaymentMethodSkrillBrandIcon {...iconSize} />
            );
        }
        case 'sticpay': {
            return <PaymentMethodSticpayBrandIcon {...iconSize} />;
        }
        case 'visa': {
            return theme === 'dark' ? (
                <PaymentMethodVisaWhiteIcon {...iconSize} />
            ) : (
                <PaymentMethodVisaBrandIcon {...iconSize} />
            );
        }
        case 'webmoney': {
            return <PaymentMethodWebmoneyBrandIcon {...iconSize} />;
        }
        case 'zingpay': {
            return theme === 'dark' ? (
                <PaymentMethodZingpayBrandDarkIcon {...iconSize} />
            ) : (
                <PaymentMethodZingpayBrandIcon {...iconSize} />
            );
        }

        default: {
            // TODO: Change this icon once actual icon is available
            return <DerivLightWalletIcon {...iconSize} />;
        }
    }
};
