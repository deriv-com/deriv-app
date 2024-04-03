import React from 'react';
import type { Meta, Story } from '@storybook/react';
import ToggleAccountType from '../index';

type ToggleAccountTypeProps = Parameters<typeof ToggleAccountType>[0];

export default {
    title: 'ToggleAccountType',
} as Meta<ToggleAccountTypeProps>;

const Template: Story<ToggleAccountTypeProps> = () => {
    const [account_type, setAccountType] = React.useState<'Real' | 'Demo'>('Real');
    return (
        <ToggleAccountType
            value={account_type}
            accountTypeChange={(event: any) => setAccountType(event.target.value)}
        />
    );
};

export const AddAppTemplate = Template.bind({});
AddAppTemplate.args = {};
