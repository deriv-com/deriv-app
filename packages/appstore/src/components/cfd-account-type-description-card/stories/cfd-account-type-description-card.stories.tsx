import type { Meta, Story } from '@storybook/react';
import React from 'react';
import CFDAccountTypeDescriptionCard from '../index';

type CFDAccountTypeDescriptionCardProps = Parameters<typeof CFDAccountTypeDescriptionCard>[0];

export default {
    title: 'CFDAccountTypeDescriptionCard',
    parameters: { controls: { sort: 'alpha' } },
    argTypes: {
        platform: {
            description: 'Platform in which CFD is traded',
            control: {
                type: 'radio',
                options: ['mt5', 'dxtrade'],
            },
            table: {
                type: { summary: '"mt5" | "dxtrade" | undefined' },
                defaultValue: { summary: 'mt5' },
            },
        },
        is_eu: {
            description: 'To Identify if the residence is eu',
            defaultValue: false,
            table: {
                type: { summary: 'boolean | undefined' },
                defaultValue: { summary: false },
            },
        },
        account_type: {
            description: 'Platform in which CFD is traded',
            control: {
                type: 'radio',
                options: ['synthetic', 'financial', 'financial_stp'],
            },
            table: {
                type: { summary: '"synthetic" | "financial" | "financial_stp"' },
                defaultValue: { summary: 'synthetic' },
            },
        },
    },
} as Meta<CFDAccountTypeDescriptionCardProps>;

const Template: Story<CFDAccountTypeDescriptionCardProps> = args => <CFDAccountTypeDescriptionCard {...args} />;

export const DefaultCFDAccountTypeDescriptionCard = Template.bind({});
DefaultCFDAccountTypeDescriptionCard.args = {
    account_type: 'synthetic',
    is_eu: false,
    platform: 'mt5',
};
