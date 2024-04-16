import {
    PaymentMethodApplePayBrandIcon,
    PaymentMethodMastercardBrandDarkIcon,
    PaymentMethodMastercardBrandIcon,
    PaymentMethodVisaBrandIcon,
    PaymentMethodVisaWhiteIcon,
} from '@deriv/quill-icons';
import type { TIconTypes } from '../../../types';

//TODO: add the rest of payment method icons from quill-icons
export const BanxaPaymentMethodIcons: TIconTypes.TIcons = {
    dark: [
        { icon: PaymentMethodVisaWhiteIcon, key: 'PaymentMethodVisaWhiteIcon' },
        { icon: PaymentMethodMastercardBrandDarkIcon, key: 'PaymentMethodMastercardBrandDarkIcon' },
        { icon: PaymentMethodApplePayBrandIcon, key: 'PaymentMethodApplePayBrandIcon' },
    ],
    light: [
        { icon: PaymentMethodVisaBrandIcon, key: 'PaymentMethodVisaBrandIcon' },
        { icon: PaymentMethodMastercardBrandIcon, key: 'PaymentMethodMastercardBrandIcon' },
        { icon: PaymentMethodApplePayBrandIcon, key: 'PaymentMethodApplePayBrandIcon' },
    ],
};
