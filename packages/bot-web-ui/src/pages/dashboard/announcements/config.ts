import { Localize, localize } from '@deriv/translations';

export type Announcement = {
    main_title: string;
    confirm_button_text: string;
    cancel_button_text: string;
    base_classname: string;
    title: string;
    subtitle: string;
    content: string[];
};

export const ANNOUNCEMENTS: Record<string, Readonly<Announcement>> = {
    ACCUMULATOR_ANNOUNCE: {
        main_title: localize('Accumulators is now on Deriv Bot'),
        confirm_button_text: localize('Try now'),
        cancel_button_text: localize('Learn more'),
        base_classname: 'announcement-dialog',
        title: localize('Accumulator Options'),
        subtitle: localize('Boost your trading strategy with Accumulators'),
        content: [localize('Leverage Accumulators to enhance potential profits with a structured approach.'),
        localize('Customize your investment period and price levels to fit your trading goals.'),
        localize('Manage risks while capitalizing on market opportunities.'),
        ],
    },
};
