import { cva, VariantProps } from 'class-variance-authority';

export const JurisdictionCardClass = cva(
    'items-stretch rounded-xl border-1 border-solid cursor-pointer flex flex-col justify-center w-full lg:w-[276px] relative h-auto transition-shadow transition-transform duration-300 [transform-style:preserve-3d] transform-gpu',
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

export const JurisdictionCardTagClass = cva('rounded-xs text-system-light-primary-background px-10 py-5', {
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

export type JurisdictionCardClassProps = NonNullable<VariantProps<typeof JurisdictionCardClass>>;
export type JurisdictionCardTagProps = NonNullable<VariantProps<typeof JurisdictionCardTagClass>>;
