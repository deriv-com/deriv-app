import React from 'react';
import type { Meta, Story } from '@storybook/react';
import AddApp from '../index';

type AddAppProps = Parameters<typeof AddApp>[0];

export default {
    title: 'AddApp',
    argTypes: {
        is_dark_mode_on: {
            description: 'Optional',
            type: 'boolean',
            defaultValue: false,
        },
        is_mobile: {
            description: 'Optional',
            type: 'boolean',
            defaultValue: false,
        },
    },
} as Meta<AddAppProps>;

const Template: Story<AddAppProps> = args => <AddApp {...args} />;

export const AddAppTemplate = Template.bind({});
AddAppTemplate.args = {
    apps: [
        {
            app_type_title: 'Deriv X Apps',
            linked_apps: [
                { app_name: 'Deriv MT5 Synthetics', app_icon: 'icDxtradeSynthetic' },
                { app_name: 'Deriv MT5 Financial USD', app_icon: 'icAppstoreWalletUsdLight' },
                { app_name: 'Deriv MT5 Financial STP USD', app_icon: 'icAppstoreWalletUsdLight' },
            ],
        },
    ],
};
