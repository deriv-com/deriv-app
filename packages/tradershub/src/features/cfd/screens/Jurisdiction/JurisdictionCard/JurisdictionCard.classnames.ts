import { cva, VariantProps } from 'class-variance-authority';
import { ExcludeAllNull } from '@deriv/quill-design';

export const JurisdictionCardClass = cva(
    'items-center rounded-800 border-sm border-solid cursor-pointer flex flex-col justify-center w-full lg:w-1/4 relative h-full transition-shadow transition-transform duration-300 [transform-style:preserve-3d] transform-gpu',
    {
        compoundVariants: [
            {
                class: 'border-system-light-secondary-background',
                isSelected: false,
            },
        ],
        variants: {
            isAdded: {
                true: 'cursor-not-allowed select-none',
            },
            isFlipped: {
                true: '[transform:rotateY(-180deg)]',
            },
            isSelected: {
                true: 'border-brand-blue shadow-[0_24px_48px_0_rgba(14,_14,_14,_0.18)]',
            },
        },
    }
);

export const JurisdictionCardTagClass = cva('rounded-200 text-system-light-primary-background px-500 py-[5px]', {
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
            'violet-dark': 'bg-brand-violet-dark',
            'yellow-dark': 'bg-brand-yellow-dark',
            'yellow-light': 'bg-brand-yellow-light',
        },
    },
});

export type JurisdictionCardClassProps = ExcludeAllNull<VariantProps<typeof JurisdictionCardClass>>;
export type JurisdictionCardTagProps = ExcludeAllNull<VariantProps<typeof JurisdictionCardTagClass>>;
