import { Localize, localize } from '@deriv/translations';

export const ANNOUNCEMENTS: any = {
    ACCUMULATOR_ANNOUNCE: {
        title: localize('Accumulators is now on Deriv Bot'),
        confirm_button_text: localize('Try now'),
        cancel_button_text: localize('Learn more'),
        base_classname: 'announcement-dialog',
        details: [
            {
                type: 'title',
                content: [localize('Accumulator Options')],
            },
            {
                type: 'subtitle',
                content: [localize('Boost your trading strategy with Accumulators')],
            },
            {
                type: 'text',
                content: [
                    localize('Leverage Accumulators to enhance potential profits with a structured approach.'),
                    localize('Customize your investment period and price levels to fit your trading goals.'),
                    localize('Manage risks while capitalizing on market opportunities.'),
                ],
            },
        ],
    },
};
