import { IconTypes } from '@deriv/quill-icons';
import { THooks } from '../../../hooks/types';
import { TIconTypes } from '../../../types';

export type TFiatOnRampProvider = {
    description: string;
    logo: {
        dark: IconTypes;
        light: IconTypes;
    };
    name: string;
    paymentMethodIcons: TIconTypes.TIcons;
    serviceName?: Extract<keyof THooks.ServiceToken, 'banxa'>;
};
