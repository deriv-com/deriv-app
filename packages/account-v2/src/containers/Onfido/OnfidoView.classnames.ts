import { cva } from 'class-variance-authority';

export const onfidoCustomClassVariant = cva('onfido-custom-container', {
    variants: {
        mobile: {
            true: 'onfido-custom-container-mobile',
        },
    },
});

export const onfidoInfoMessageVariant = cva(
    'absolute p-8 top-4 min-h-34 text-center z-[1] w-full [transition:transform_0.35s_linear_4.65s] origin-top',
    {
        variants: {
            showStatusMessage: {
                true: 'scale-y-0',
                false: 'invisible',
            },
        },
    }
);
