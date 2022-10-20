import type { Meta, Story } from '@storybook/react';
import React from 'react';
import { PlatformCard } from '../index';

type PlatformCardProps = Parameters<typeof PlatformCard>[0];

export default {
    title: 'PlatformCard',
    parameters: { controls: { sort: 'alpha' } },
    argTypes: {
        platform_name: {
            description: 'Set platform name',
            defaultValue: false,
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: false },
            },
        },
        icon_title: {
            description: 'Set icon name for the platform',
            defaultValue: undefined,
            table: {
                type: { summary: 'string | undefined' },
                defaultValue: { summary: undefined },
            },
        },
        description: {
            description: 'Set the platform details',
            defaultValue: undefined,
            table: {
                type: { summary: 'string | undefined' },
                defaultValue: { summary: undefined },
            },
        },
        checked: {
            description: 'If set to `true`, checked icon will appear.',
            defaultValue: false,
            table: {
                type: { summary: 'boolean | undefined' },
                defaultValue: { summary: false },
            },
        },
    },
} as Meta<PlatformCardProps>;

const Template: Story<PlatformCardProps> = args => <PlatformCard {...args} />;

export const DerivMT5Platform = Template.bind({});
DerivMT5Platform.args = {
    platform_name: 'Deriv MT5',
    icon_title: 'icBrandDmt5',
    description: 'Trade on Deriv MT5 (DMT5), the all-in-one FX and CFD trading platform.',
    checked: true,
};

export const DerivXPlatform = Template.bind({});
DerivXPlatform.args = {
    platform_name: 'Deriv X',
    icon_title: 'icBrandDxtrade',
    description: 'Trade FX and CFDs on a customisable, easy-to-use trading platform.',
    checked: false,
};
