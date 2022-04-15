import type { Meta, Story } from '@storybook/react';
import React from 'react';
import AppWalletModal from '../index';

type AppWalletModalProps = Parameters<typeof AppWalletModal>[0];

export default {
    title: 'AppWalletModal',
    parameters: { controls: { sort: 'alpha' } },
} as Meta<AppWalletModalProps>;

const Template: Story<AppWalletModalProps> = args => <AppWalletModal {...args} />;

const ModalTrigger = <div onClick={() => {}}>Transfer</div>;

const ModalBody = <div>Modal Body</div>;

export const DefaultUnlinkedLightLarge = Template.bind({});
DefaultUnlinkedLightLarge.args = {
    modal_trigger_children: ModalTrigger,
    modal_body_children: ModalBody,
    balance: '10,0000.00',
    currency: 'USD',
    dark: false,
    message: 'Message goes here',
    message_type: 'information',
    wallet_name: 'Astropay',
};
