import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

export const DialogTrigger = DialogPrimitive.Trigger;

export interface AppWalletModalTriggerProps {
    children?: React.ReactElement | React.ReactElement[];
}

const AppWalletModalTrigger = ({ children }: AppWalletModalTriggerProps) => {
    return (
        <React.Fragment>
            {React.Children?.map(children, (child) => {
                return <DialogTrigger>{child}</DialogTrigger>;
            })}
        </React.Fragment>
    );
};

export default AppWalletModalTrigger;
