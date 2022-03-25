import type { Meta, Story } from '@storybook/react';
import React from 'react';
import CreateWallet from '../index';

type CreateWalletProps = Parameters<typeof CreateWallet>;

export default {} as Meta<CreateWalletProps>;

const Template: Story<CreateWalletProps> = () => <CreateWallet />;

export const CreateWalletTemplate = Template.bind({});

