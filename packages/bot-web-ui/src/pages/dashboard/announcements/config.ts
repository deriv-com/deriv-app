import { localize } from '@deriv/translations';

export type TContentItem = {
    id: number;
    text: string;
};

export type TAnnouncement = {
    main_title: string;
    confirm_button_text: string;
    cancel_button_text: string;
    base_classname: string;
    title: string;
    subtitle: string;
    content: TContentItem[];
};

export const ANNOUNCEMENTS: Record<string, Readonly<TAnnouncement>> = {
    ACCUMULATOR_ANNOUNCE: {
        main_title: localize('Accumulators is now on Deriv Bot'),
        confirm_button_text: localize('Try now'),
        cancel_button_text: localize('Learn more'),
        base_classname: 'announcement-dialog',
        title: localize('Accumulator Options'),
        subtitle: localize('Boost your trading strategy with Accumulators'),
        content: [
            { id: 0, text: localize('Leverage Accumulators to enhance potential profits with a structured approach.') },
            { id: 1, text: localize('Customize your investment period and price levels to fit your trading goals.') },
            { id: 2, text: localize('Manage risks while capitalizing on market opportunities.') },
        ],
    },
};
