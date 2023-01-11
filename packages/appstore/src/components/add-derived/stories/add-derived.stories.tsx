import React from 'react';
import type { Meta, Story } from '@storybook/react';
import AddDerived from '../index';

type AddDerivedProps = Parameters<typeof AddDerived>[0];

export default {
    title: 'AddDerived',
    argTypes: {
        title: {
            type: 'string',
            defaultValue: 'More Derived accounts',
        },
        class_names: {
            type: 'string',
            defaultValue: '',
        },
    },
} as Meta<AddDerivedProps>;

const Template: Story<AddDerivedProps> = args => <AddDerived {...args} />;

export const AppLauncherTemplate = Template.bind({});
