import type { Meta, Story } from '@storybook/react';
import React from 'react';
import SkeletonCard from '../index';

type SkeletonCardProps = Parameters<typeof SkeletonCard>[0];

export default {
    title: 'SkeletonCard',
    parameters: { controls: { sort: 'alpha' } },
    argTypes: {
        label: {
            defaultValue: 'Wallet',
            description: 'Optional. Description for the skeleton card',
            control: {
                type: 'text',
            },
        },
        should_highlight: {
            description: 'Optional. If set to `true`, border color is changed to coral red',
            type: 'boolean',
            defaultValue: false,
        },
        is_add_card: {
            description: 'Optional',
            type: 'boolean',
            defaultValue: false,
        },
    },
} as Meta<SkeletonCardProps>;

const Template: Story<SkeletonCardProps> = args => <SkeletonCard {...args} />;

export const SkeletonCardTemplate = Template.bind({});
SkeletonCardTemplate.args = {};
