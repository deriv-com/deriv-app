import type { Meta, Story } from '@storybook/react';
import React from 'react';
import CFDAccountTypeDetails from '../index';

type CFDAccountTypeDetailsProps = Parameters<typeof CFDAccountTypeDetails>[0];

export default {
    title: 'CFDAccountTypeDetails',
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
        residence: {
            description: 'To Identify if the residence',
            control: {
                type: 'radio',
                options: ['eu', 'au', 'others'],
            },
            table: {
                type: { summary: '"eu" | "au" | "others"' },
                defaultValue: { summary: 'eu' },
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
} as Meta<CFDAccountTypeDetailsProps>;

const Template: Story<CFDAccountTypeDetailsProps> = args => <CFDAccountTypeDetails {...args} />;

export const DefaultCFDAccountTypeDetails = Template.bind({});
DefaultCFDAccountTypeDetails.args = {
    account_type: 'synthetic',
    residence: 'eu',
    platform: 'mt5',
};
