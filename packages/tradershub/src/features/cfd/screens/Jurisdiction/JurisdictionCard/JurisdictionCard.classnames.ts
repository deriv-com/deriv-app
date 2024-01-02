import { cva, VariantProps } from 'class-variance-authority';
import { ExcludeAllNull } from '@deriv/quill-design';

export const JurisdictionCardClass = cva(
    'items-center rounded-800 border-sm border-system-light-secondary-background cursor-pointer flex flex-col justify-center w-full lg:w-1/4 relative h-full transition-shadow duration-300 transform-gpu',
    {
        variants: {
            isAdded: {
                true: 'cursor-not-allowed select-none',
            },
            isFlipped: {
                true: 'rotate-180',
            },
            isSelected: {
                true: 'border-sm border-solid border-system-light-primary-background',
            },
        },
    }
);

export const JurisdictionCardTagClass = cva(
    'rounded-200 bg-brand-red-darker text-system-light-primary-background px-500 py-[5px]',
    {
        defaultVariants: {
            displayTextSkinColor: 'default',
        },
        variants: {
            displayTextSkinColor: {
                'brown-dark': 'bg-brand-brown-dark',
                default: 'bg-brand-red-dark',
                'red-dark': 'bg-brand-red-dark',
                'red-darker': 'bg-brand-red-darker',
                'red-light': 'bg-brand-red-light',
                'voilet-dark': 'bg-brand-voilet-dark',
                'yellow-dark': 'bg-brand-yellow-dark',
                'yellow-light': 'bg-brand-yellow-light',
            },
        },
    }
);

export type JurisdictionCardClassProps = ExcludeAllNull<VariantProps<typeof JurisdictionCardClass>>;
export type JurisdictionCardTagProps = ExcludeAllNull<VariantProps<typeof JurisdictionCardTagClass>>;
