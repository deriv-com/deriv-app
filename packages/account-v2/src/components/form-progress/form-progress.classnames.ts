import { cva } from 'class-variance-authority';

const stepperBaseStyles =
    'z-10 box-border flex h-800 w-800 items-center rounded-pill outline outline-2 outline-solid-grey-1';

export const stepperVariants = cva(stepperBaseStyles, {
    variants: {
        variant: {
            isActive: {
                true: 'group-aria-[current=true]:outline-solid-coral-700 group-aria-[current=true]:transition-all group-aria-[current=true]:delay-700 group-aria-[current=true]:duration-700 group-aria-[current=true]:ease-out',
            },
        },
    },
});
