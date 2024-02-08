import { cva } from 'class-variance-authority';

export const OnfidoCustomClass = cva('onfido-custom-container', {
    variants: {
        mobile: {
            true: 'onfido-custom-container-mobile',
        },
    },
});
