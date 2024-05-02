import {
    PaymentMethodAlipayBrandDarkIcon,
    PaymentMethodAlipayBrandIcon,
    PaymentMethodBankCentralAsiaBcaBrandIcon,
    PaymentMethodBankNegaraIndonesiaBniBrandIcon,
    PaymentMethodBankRakyatIndonesiaBriBrandIcon,
    PaymentMethodBitcoinBrandDarkIcon,
    PaymentMethodBitcoinBrandIcon,
    PaymentMethodBitcoinCashBrandDarkIcon,
    PaymentMethodBitcoinCashBrandIcon,
    PaymentMethodCimbniagaBrandDarkIcon,
    PaymentMethodCimbniagaBrandIcon,
    PaymentMethodCreditDebitBrandDarkIcon,
    PaymentMethodCreditDebitBrandIcon,
    PaymentMethodCryptosBrandDarkIcon,
    PaymentMethodCryptosBrandIcon,
    PaymentMethodDaiBrandIcon,
    PaymentMethodDiamondBankBrandDarkIcon,
    PaymentMethodDiamondBankBrandIcon,
    PaymentMethodEthereumBrandIcon,
    PaymentMethodEthereumWhiteIcon,
    PaymentMethodEWalletBrandDarkIcon,
    PaymentMethodEWalletBrandIcon,
    PaymentMethodFirstBankBrandDarkIcon,
    PaymentMethodFirstBankBrandIcon,
    PaymentMethodGuaranteeTrustBankGtcoBrandIcon,
    PaymentMethodIcbcBankBrandDarkIcon,
    PaymentMethodIcbcBankBrandIcon,
    PaymentMethodInstantBankTransferBlackIcon,
    PaymentMethodInstantBankTransferBrandDarkIcon,
    PaymentMethodLibertyReserveBrandDarkIcon,
    PaymentMethodLibertyReserveBrandIcon,
    PaymentMethodLitecoinBrandIcon,
    PaymentMethodLitecoinWhiteIcon,
    PaymentMethodMandiriBrandDarkIcon,
    PaymentMethodMandiriBrandIcon,
    PaymentMethodMandiriSyariahBrandDarkIcon,
    PaymentMethodMandiriSyariahBrandIcon,
    PaymentMethodMoneygramBrandDarkIcon,
    PaymentMethodMoneygramBrandIcon,
    PaymentMethodPaypalBrandIcon,
    PaymentMethodPerfectMoneyBrandIcon,
    PaymentMethodPerfectMoneyWhiteIcon,
    PaymentMethodPermataBankBrandDarkIcon,
    PaymentMethodPermataBankBrandIcon,
    PaymentMethodTetherUsdtBrandIcon,
    PaymentMethodTetherUsdtWhiteIcon,
    PaymentMethodVerveBrandDarkIcon,
    PaymentMethodVerveBrandIcon,
    PaymentMethodWebmoneyBrandIcon,
    PaymentMethodWebmoneyWhiteIcon,
    PaymentMethodWechatPayBrandIcon,
    PaymentMethodZenithBankBrandIcon,
} from '@deriv/quill-icons';
import type { TIconTypes } from '../../../types';

type TPaymentMethodIcons = Record<string, { dark: TIconTypes.TIcon; light: TIconTypes.TIcon }>;

export const paymentMethodIcons: TPaymentMethodIcons = {
    Alipay: {
        dark: {
            icon: PaymentMethodAlipayBrandDarkIcon,
            key: 'PaymentMethodAlipayBrandDarkIcon',
        },
        light: {
            icon: PaymentMethodAlipayBrandIcon,
            key: 'PaymentMethodAlipayBrandIcon',
        },
    },
    Bank: {
        dark: {
            icon: PaymentMethodInstantBankTransferBrandDarkIcon,
            key: 'PaymentMethodInstantBankTransferBrandDarkIcon',
        },
        light: {
            icon: PaymentMethodInstantBankTransferBlackIcon,
            key: 'PaymentMethodInstantBankTransferBlackIcon',
        },
    },
    Bankbri: {
        dark: {
            icon: PaymentMethodBankRakyatIndonesiaBriBrandIcon,
            key: 'PaymentMethodBankRakyatIndonesiaBriBrandIcon',
        },
        light: {
            icon: PaymentMethodBankRakyatIndonesiaBriBrandIcon,
            key: 'PaymentMethodBankRakyatIndonesiaBriBrandIcon',
        },
    },
    Bca: {
        dark: {
            icon: PaymentMethodBankCentralAsiaBcaBrandIcon,
            key: 'PaymentMethodBankCentralAsiaBcaBrandIcon',
        },
        light: {
            icon: PaymentMethodBankCentralAsiaBcaBrandIcon,
            key: 'PaymentMethodBankCentralAsiaBcaBrandIcon',
        },
    },
    Bch: {
        dark: {
            icon: PaymentMethodBitcoinCashBrandDarkIcon,
            key: 'PaymentMethodBitcoinCashBrandDarkIcon',
        },
        light: {
            icon: PaymentMethodBitcoinCashBrandIcon,
            key: 'PaymentMethodBitcoinCashBrandIcon',
        },
    },
    Bitcoin: {
        dark: {
            icon: PaymentMethodBitcoinBrandDarkIcon,
            key: 'PaymentMethodBitcoinBrandDarkIcon',
        },
        light: {
            icon: PaymentMethodBitcoinBrandIcon,
            key: 'PaymentMethodBitcoinBrandIcon',
        },
    },
    Bni: {
        dark: {
            icon: PaymentMethodBankNegaraIndonesiaBniBrandIcon,
            key: 'PaymentMethodBankNegaraIndonesiaBniBrandIcon',
        },
        light: {
            icon: PaymentMethodBankNegaraIndonesiaBniBrandIcon,
            key: 'PaymentMethodBankNegaraIndonesiaBniBrandIcon',
        },
    },
    Card: {
        dark: {
            icon: PaymentMethodCreditDebitBrandDarkIcon,
            key: 'PaymentMethodCreditDebitBrandDarkIcon',
        },
        light: {
            icon: PaymentMethodCreditDebitBrandIcon,
            key: 'PaymentMethodCreditDebitBrandIcon',
        },
    },
    Cimbniaga: {
        dark: {
            icon: PaymentMethodCimbniagaBrandDarkIcon,
            key: 'PaymentMethodCimbniagaBrandDarkIcon',
        },
        light: {
            icon: PaymentMethodCimbniagaBrandIcon,
            key: 'PaymentMethodCimbniagaBrandIcon',
        },
    },
    Crypto: {
        dark: {
            icon: PaymentMethodCryptosBrandDarkIcon,
            key: 'PaymentMethodCryptosBrandDarkIcon',
        },
        light: {
            icon: PaymentMethodCryptosBrandIcon,
            key: 'PaymentMethodCryptosBrandIcon',
        },
    },
    Dai: {
        dark: {
            icon: PaymentMethodDaiBrandIcon,
            key: 'PaymentMethodDaiBrandIcon',
        },
        light: {
            icon: PaymentMethodDaiBrandIcon,
            key: 'PaymentMethodDaiBrandIcon',
        },
    },
    Diamondbank: {
        dark: {
            icon: PaymentMethodDiamondBankBrandDarkIcon,
            key: 'PaymentMethodDiamondBankBrandDarkIcon',
        },
        light: {
            icon: PaymentMethodDiamondBankBrandIcon,
            key: 'PaymentMethodDiamondBankBrandIcon',
        },
    },
    Eth: {
        dark: {
            icon: PaymentMethodEthereumWhiteIcon,
            key: 'PaymentMethodEthereumWhiteIcon',
        },
        light: {
            icon: PaymentMethodEthereumBrandIcon,
            key: 'PaymentMethodEthereumBrandIcon',
        },
    },
    Ewallet: {
        dark: {
            icon: PaymentMethodEWalletBrandDarkIcon,
            key: 'PaymentMethodEWalletBrandDarkIcon',
        },
        light: {
            icon: PaymentMethodEWalletBrandIcon,
            key: 'PaymentMethodEWalletBrandIcon',
        },
    },
    Firstbank: {
        dark: {
            icon: PaymentMethodFirstBankBrandDarkIcon,
            key: 'PaymentMethodFirstBankBrandDarkIcon',
        },
        light: {
            icon: PaymentMethodFirstBankBrandIcon,
            key: 'PaymentMethodFirstBankBrandIcon',
        },
    },
    Gtbank: {
        dark: {
            icon: PaymentMethodGuaranteeTrustBankGtcoBrandIcon,
            key: 'PaymentMethodGuaranteeTrustBankGtcoBrandIcon',
        },
        light: {
            icon: PaymentMethodGuaranteeTrustBankGtcoBrandIcon,
            key: 'PaymentMethodGuaranteeTrustBankGtcoBrandIcon',
        },
    },
    Icbc: {
        dark: {
            icon: PaymentMethodIcbcBankBrandDarkIcon,
            key: 'PaymentMethodIcbcBankBrandDarkIcon',
        },
        light: {
            icon: PaymentMethodIcbcBankBrandIcon,
            key: 'PaymentMethodIcbcBankBrandIcon',
        },
    },
    Libertyreserve: {
        dark: {
            icon: PaymentMethodLibertyReserveBrandDarkIcon,
            key: 'PaymentMethodLibertyReserveBrandDarkIcon',
        },
        light: {
            icon: PaymentMethodLibertyReserveBrandIcon,
            key: 'PaymentMethodLibertyReserveBrandIcon',
        },
    },
    LiteCoin: {
        dark: {
            icon: PaymentMethodLitecoinWhiteIcon,
            key: 'PaymentMethodLitecoinWhiteIcon',
        },
        light: {
            icon: PaymentMethodLitecoinBrandIcon,
            key: 'PaymentMethodLitecoinBrandIcon',
        },
    },
    Mandiri: {
        dark: {
            icon: PaymentMethodMandiriBrandDarkIcon,
            key: 'PaymentMethodMandiriBrandDarkIcon',
        },
        light: {
            icon: PaymentMethodMandiriBrandIcon,
            key: 'PaymentMethodMandiriBrandIcon',
        },
    },
    Mandirisyariah: {
        dark: {
            icon: PaymentMethodMandiriSyariahBrandDarkIcon,
            key: 'PaymentMethodMandiriSyariahBrandDarkIcon',
        },
        light: {
            icon: PaymentMethodMandiriSyariahBrandIcon,
            key: 'PaymentMethodMandiriSyariahBrandIcon',
        },
    },
    Moneygram: {
        dark: {
            icon: PaymentMethodMoneygramBrandDarkIcon,
            key: 'PaymentMethodMoneygramBrandDarkIcon',
        },
        light: {
            icon: PaymentMethodMoneygramBrandIcon,
            key: 'PaymentMethodMoneygramBrandIcon',
        },
    },
    Paypal: {
        dark: {
            icon: PaymentMethodPaypalBrandIcon,
            key: 'PaymentMethodPaypalBrandIcon',
        },
        light: {
            icon: PaymentMethodPaypalBrandIcon,
            key: 'PaymentMethodPaypalBrandIcon',
        },
    },
    PerfectMoney: {
        dark: {
            icon: PaymentMethodPerfectMoneyWhiteIcon,
            key: 'PaymentMethodPerfectMoneyWhiteIcon',
        },
        light: {
            icon: PaymentMethodPerfectMoneyBrandIcon,
            key: 'PaymentMethodPerfectMoneyBrandIcon',
        },
    },
    Permatabank: {
        dark: {
            icon: PaymentMethodPermataBankBrandDarkIcon,
            key: 'PaymentMethodPermataBankBrandDarkIcon',
        },
        light: {
            icon: PaymentMethodPermataBankBrandIcon,
            key: 'PaymentMethodPermataBankBrandIcon',
        },
    },
    Tether: {
        dark: {
            icon: PaymentMethodTetherUsdtWhiteIcon,
            key: 'PaymentMethodTetherUsdtWhiteIcon',
        },
        light: {
            icon: PaymentMethodTetherUsdtBrandIcon,
            key: 'PaymentMethodTetherUsdtBrandIcon',
        },
    },
    Verve: {
        dark: {
            icon: PaymentMethodVerveBrandDarkIcon,
            key: 'PaymentMethodVerveBrandDarkIcon',
        },
        light: {
            icon: PaymentMethodVerveBrandIcon,
            key: 'PaymentMethodVerveBrandIcon',
        },
    },
    WebMoney: {
        dark: {
            icon: PaymentMethodWebmoneyWhiteIcon,
            key: 'PaymentMethodWebmoneyWhiteIcon',
        },
        light: {
            icon: PaymentMethodWebmoneyBrandIcon,
            key: 'PaymentMethodWebmoneyBrandIcon',
        },
    },
    Wechatpay: {
        dark: {
            icon: PaymentMethodWechatPayBrandIcon,
            key: 'PaymentMethodWechatPayBrandIcon',
        },
        light: {
            icon: PaymentMethodWechatPayBrandIcon,
            key: 'PaymentMethodWechatPayBrandIcon',
        },
    },
    Zenithbank: {
        dark: {
            icon: PaymentMethodZenithBankBrandIcon,
            key: 'PaymentMethodZenithBankBrandIcon',
        },
        light: {
            icon: PaymentMethodZenithBankBrandIcon,
            key: 'PaymentMethodZenithBankBrandIcon',
        },
    },
};
