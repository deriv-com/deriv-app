import { cva } from 'class-variance-authority';

const iconButtonBaseClass = 'grid place-content-center border-none hover:cursor-pointer disabled:hidden';

export const iconButtonVariants = cva(iconButtonBaseClass, {
    variants: {
        isRound: {
            true: 'rounded-full',
            false: 'rounded-4',
        },
        size: {
            sm: 'p-4 h-24 rounded-4',
            md: 'p-8 h-32 rounded-64',
            lg: 'p-12 h-40 rounded-full',
        },
        color: {
            primary: 'bg-typography-link hover:bg-solid-red-5',
            white: 'bg-solid-slate-0 hover:bg-solid-grey-5',
            black: 'bg-solid-black-0 hover:bg-solid-black-8',
            transparent: 'bg-[transparent] hover:bg-solid-grey-5',
        },
    },
    defaultVariants: {
        isRound: false,
        size: 'sm',
        color: 'primary',
    },
});
