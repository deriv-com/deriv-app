import React from 'react';
import type { Meta, Story } from '@storybook/react';
import AppLauncher from '../index';

type AppLauncherProps = Parameters<typeof AppLauncher>[0];

export default {
    title: 'AppLauncher',
    argTypes: {
        icon_name: {
            type: 'string',
            defaultValue: 'icDxtradeSynthetic',
        },
        app_name: {
            type: 'string',
            defaultValue: 'App name',
        },
        jurisdiction: {
            type: 'string',
            defaultValue: 'JURISDICTION',
        },
        is_app_installed: {
            type: 'boolean',
            defaultValue: false,
        },
        balance: {
            type: 'number',
            defaultValue: 1.23,
        },
        currency: {
            type: 'string',
            defaultValue: 'USD',
        },
        description: {
            type: 'string',
            defaultValue: 'Trade multipliers on forex, cryptocurrencies, and synthetic indices with our mobile app.',
        },
        show_active_balance: {
            type: 'boolean',
            defaultValue: false,
        },
    },
} as Meta<AppLauncherProps>;

const Template: Story<AppLauncherProps> = args => <AppLauncher {...args} />;

export const AppLauncherTemplate = Template.bind({});
