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

type TPaymentMethodIcons = Record<string, { dark: TIconTypes.TIcon; light: TIconTypes.TIcon; variants: string[] }>;

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
        variants: ['alipay'],
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
        variants: [
            'bank',
            'bankdeposit',
            'banks',
            'banktransfer',
            'bankwire',
            'bankwiretransfer',
            'localbankwire',
            'localbank',
            'localbanks',
            'localbanktransfer',
        ],
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
        variants: ['bri', 'bankbri'],
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
        variants: ['bca', 'grupbca'],
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
        variants: ['bch'],
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
        variants: ['bitcoin', 'btc'],
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
        variants: ['bni'],
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
        variants: ['card', 'cards', 'visa', 'mastercard'],
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
        variants: ['cimbniaga'],
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
        variants: ['crypto', 'cryptos', 'cryptocurrencies', 'cryptocurrency', 'weacceptcrypto'],
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
        variants: ['dai'],
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
        variants: ['diamondbank'],
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
        variants: ['eth', 'ethd', 'ethereum'],
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
        variants: ['ewallet', 'ewallets', 'ewalletpayment', 'skrill'],
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
        variants: ['firstbank'],
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
        variants: ['gtbank'],
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
        variants: ['icbc'],
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
        variants: ['libertyreserve'],
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
        variants: ['ltc', 'litecoin'],
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
        variants: ['mandiri'],
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
        variants: ['mandirisyariah'],
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
        variants: ['moneygram'],
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
        variants: ['paypal'],
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
        variants: ['perfectmoneyandwebmoney', 'perfectmoney'],
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
        variants: ['permatabank'],
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
        variants: ['tether'],
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
        variants: ['verve'],
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
        variants: ['perfectmoneyandwebmoney', 'webmoney'],
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
        variants: ['wechatpay'],
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
        variants: ['zenithbank'],
    },
};
