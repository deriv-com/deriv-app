import type { Meta, Story } from '@storybook/react';
import React from 'react';
import { TradeTypeCard } from '../index';

type TradeTypeCardProps = Parameters<typeof TradeTypeCard>[0];

export default {
    title: 'TradeTypeCard',
    parameters: { controls: { sort: 'alpha' } },
    argTypes: {
        type: {
            description: 'Set Trade type name',
            defaultValue: false,
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: false },
            },
        },
        icon_title: {
            description: 'Set icon name for trade type',
            defaultValue: undefined,
            table: {
                type: { summary: 'string | undefined' },
                defaultValue: { summary: undefined },
            },
        },
        description: {
            description: 'Set the trade type details',
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
        bg_image_title: {
            description: 'Set background image',
            defaultValue: false,
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: false },
            },
        },
    },
} as Meta<TradeTypeCardProps>;

const Template: Story<TradeTypeCardProps> = args => <TradeTypeCard {...args} />;

export const CFDTradeType = Template.bind({});
CFDTradeType.args = {
    type: 'CFDs',
    icon_title: 'icAppstoreMultipliersTradeType',
    description: 'Trade with leverage and tight spreads for better returns on successful trades.',
    checked: true,
    bg_image_title: 'appstore_cfds_trade_type_bg',
};

export const MultipliersTradeType = Template.bind({});
MultipliersTradeType.args = {
    type: 'Multipliers',
    icon_title: 'icAppstoreCfdsTradeType',
    description: 'Combine the upside of CFDs with the simplicity of options.',
    checked: true,
    bg_image_title: 'appstore_multipliers_trade_type_bg',
};

export const OptionsTradeType = Template.bind({});
OptionsTradeType.args = {
    type: 'Options',
    icon_title: 'icAppstoreOptionTradeType',
    description: 'Earn fixed payouts by predicting an asset price movement.',
    checked: true,
    bg_image_title: 'appstore_options_trade_type_bg',
};
