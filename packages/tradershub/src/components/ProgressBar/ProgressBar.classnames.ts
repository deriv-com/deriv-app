import { cva } from 'class-variance-authority';

const progressBarBaseStyles =
    'z-10 box-border flex h-16 w-16 items-center rounded-full outline outline-2 transition-all delay-8 duration-8 ease-out ';

export const stepperVariants = cva(progressBarBaseStyles, {
    compoundVariants: [
        {
            class: 'bg-solid-grey-default',
            isActive: false,
            isFilled: true,
        },
        {
            class: 'bg-solid-coral-700',
            isActive: true,
            isFilled: true,
        },
    ],
    variants: {
        isActive: {
            false: 'outline-solid-grey-default',
            true: 'outline-solid-coral-700',
        },
        isFilled: {
            true: '',
        },
    },
});

export const desktopStyle = {
    connector: 'lg:h-40 lg:w-1 lg:bg-[length:100%_200%] lg:bg-bottom lg:bg-gradient-to-b lg:aria-[current=true]:bg-top',
    stepper: 'lg:flex lg:w-fit lg:items-end lg:gap-12',
};

export const mobileStyle = {
    connector: 'bg-[length:200%_100%] bg-right bg-gradient-to-r aria-[current=true]:bg-left w-auto h-2',
};
