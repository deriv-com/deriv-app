import { cva } from 'class-variance-authority';

const iconButtonBaseClass = 'grid place-content-center border-none hover:cursor-pointer disabled:hidden';

export const iconButtonVariants = cva(iconButtonBaseClass, {
    defaultVariants: {
        color: 'primary',
        isRound: false,
        size: 'sm',
    },
    variants: {
        color: {
            black: 'bg-solid-black-0 hover:bg-solid-black-8',
            primary: 'bg-typography-link hover:bg-solid-red-5',
            transparent: 'bg-[transparent] hover:bg-solid-grey-5',
            white: 'bg-solid-slate-0 hover:bg-solid-grey-5',
        },
        isRound: {
            false: 'rounded-4',
            true: 'rounded-full',
        },
        size: {
            lg: 'p-12 h-40 rounded-full',
            md: 'p-8 h-32 rounded-64',
            sm: 'p-4 h-24 rounded-4',
        },
    },
});
