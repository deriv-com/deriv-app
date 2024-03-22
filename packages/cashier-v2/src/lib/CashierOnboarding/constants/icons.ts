import {
    PaymentMethodBanxaBrandDarkIcon,
    PaymentMethodBanxaBrandIcon,
    PaymentMethodBitcoinBrandDarkIcon,
    PaymentMethodBitcoinBrandIcon,
    PaymentMethodCreditDebitBrandDarkIcon,
    PaymentMethodCreditDebitBrandIcon,
    PaymentMethodEthereumBlackIcon,
    PaymentMethodEthereumBrandIcon,
    PaymentMethodEWalletBrandDarkIcon,
    PaymentMethodEWalletBrandIcon,
    PaymentMethodInstantBankTransferBrandDarkIcon,
    PaymentMethodInstantBankTransferBrandIcon,
    PaymentMethodLitecoinBrandIcon,
    PaymentMethodLitecoinWhiteIcon,
    PaymentMethodLocalPaymentMethodsBrandDarkIcon,
    PaymentMethodLocalPaymentMethodsBrandIcon,
    PaymentMethodTetherUsdtBrandIcon,
    PaymentMethodTetherUsdtWhiteIcon,
    PaymentMethodUsdCoinBrandDarkIcon,
    PaymentMethodUsdCoinBrandIcon,
} from '@deriv/quill-icons';
import type { TIconTypes } from '../../../types';

export const onboardingFiatCardIcons: TIconTypes.TIcons = {
    dark: [
        { icon: PaymentMethodCreditDebitBrandDarkIcon, key: 'PaymentMethodCreditDebitBrandDarkIcon' },
        { icon: PaymentMethodInstantBankTransferBrandDarkIcon, key: 'PaymentMethodInstantBankTransferBrandDarkIcon' },
        { icon: PaymentMethodEWalletBrandDarkIcon, key: 'PaymentMethodEWalletBrandDarkIcon' },
        { icon: PaymentMethodLocalPaymentMethodsBrandDarkIcon, key: 'PaymentMethodLocalPaymentMethodsBrandDarkIcon' },
    ],
    light: [
        { icon: PaymentMethodCreditDebitBrandIcon, key: 'PaymentMethodCreditDebitBrandIcon' },
        { icon: PaymentMethodInstantBankTransferBrandIcon, key: 'PaymentMethodInstantBankTransferBrandIcon' },
        { icon: PaymentMethodEWalletBrandIcon, key: 'PaymentMethodEWalletBrandIcon' },
        { icon: PaymentMethodLocalPaymentMethodsBrandIcon, key: 'PaymentMethodLocalPaymentMethodsBrandIcon' },
    ],
};

export const onboardingCryptoCardIcons: TIconTypes.TIcons = {
    dark: [
        { icon: PaymentMethodBitcoinBrandDarkIcon, key: 'PaymentMethodBitcoinBrandDarkIcon' },
        { icon: PaymentMethodEthereumBrandIcon, key: 'PaymentMethodEthereumBrandIcon' },
        { icon: PaymentMethodLitecoinWhiteIcon, key: 'PaymentMethodLitecoinWhiteIcon' },
        { icon: PaymentMethodUsdCoinBrandDarkIcon, key: 'PaymentMethodUsdCoinBrandDarkIcon' },
        { icon: PaymentMethodTetherUsdtWhiteIcon, key: 'PaymentMethodTetherUsdtWhiteIcon' },
    ],
    light: [
        { icon: PaymentMethodBitcoinBrandIcon, key: 'PaymentMethodBitcoinBrandIcon' },
        { icon: PaymentMethodEthereumBlackIcon, key: 'PaymentMethodEthereumBlackIcon' },
        { icon: PaymentMethodLitecoinBrandIcon, key: 'PaymentMethodLitecoinBrandIcon' },
        { icon: PaymentMethodUsdCoinBrandIcon, key: 'PaymentMethodUsdCoinBrandIcon' },
        { icon: PaymentMethodTetherUsdtBrandIcon, key: 'PaymentMethodTetherUsdtBrandIcon' },
    ],
};

export const onboardingOnrampIcons: TIconTypes.TIcons = {
    dark: [{ icon: PaymentMethodBanxaBrandDarkIcon, key: 'PaymentMethodBanxaBrandDarkIcon' }],
    light: [{ icon: PaymentMethodBanxaBrandIcon, key: 'PaymentMethodBanxaBrandIcon' }],
};
