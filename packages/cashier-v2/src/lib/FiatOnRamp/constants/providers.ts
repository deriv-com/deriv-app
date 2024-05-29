import { PaymentMethodBanxaBrandDarkIcon, PaymentMethodBanxaBrandIcon } from '@deriv/quill-icons';
import type { TFiatOnRampProvider } from '../types';
import { BanxaPaymentMethodIcons } from './icons';

const BanxaProvider: TFiatOnRampProvider = {
    description:
        'A fast and secure fiat-to-crypto payment service. Deposit cryptocurrencies from anywhere in the world using your credit/debit cards and bank transfers.',
    logo: { dark: PaymentMethodBanxaBrandDarkIcon, light: PaymentMethodBanxaBrandIcon },
    name: 'Banxa',
    paymentMethodIcons: BanxaPaymentMethodIcons,
    serviceName: 'banxa',
};

export const fiatOnRampProviders = [BanxaProvider];
