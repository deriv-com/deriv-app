import { cva } from 'class-variance-authority';

const iconButtonBaseClass = 'grid place-content-center border-none hover:cursor-pointer disabled:hidden';

export const iconButtonVariants = cva(iconButtonBaseClass, {
    variants: {
        isRound: {
            true: 'rounded-pill',
            false: 'rounded-200',
        },
        size: {
            sm: 'p-200 h-1200 rounded-200',
            md: 'p-400 h-1600 rounded-3200',
            lg: 'p-600 h-2000 rounded-pill',
        },
        color: {
            primary: 'bg-typography-link hover:bg-solid-red-5',
            white: 'bg-solid-slate-50 hover:bg-solid-grey-5',
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
