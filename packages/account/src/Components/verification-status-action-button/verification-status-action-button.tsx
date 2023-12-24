import React from 'react';
import { Button, ButtonLink, Text } from '@deriv/components';
import style from './verification-status-action-button.module.scss';

type TButtonLink = {
    onClick?: never;
    to: string;
};

type TButton = {
    onClick?: React.MouseEventHandler<HTMLElement>;
    to?: never;
};

type TVerificationStatusActionButton = { button_text: JSX.Element } & (TButtonLink | TButton);

const VerificationStatusActionButton = ({ button_text, onClick, to }: TVerificationStatusActionButton) => {
    return (
        <React.Fragment>
            {to ? (
                <ButtonLink className={style.actionButton} to={to}>
                    <Text size='xs' as='p' weight='bold' color='colored-background'>
                        {button_text}
                    </Text>
                </ButtonLink>
            ) : (
                <Button
                    className={style.actionButton}
                    type='button'
                    onClick={onClick}
                    has_effect
                    primary
                    color='colored-background'
                >
                    <Text size='xs' weight='bold' as='p' color='colored-background'>
                        {button_text}
                    </Text>
                </Button>
            )}
        </React.Fragment>
    );
};
export default VerificationStatusActionButton;
