import classNames from 'classnames';
import React from 'react';
import AppCardFooterItem from './app-card-footer-item';
import { TCardLables, TVariant } from '../../../types';

type TAppCardFooterProps = {
    broker: string;
    card_labels: TCardLables;
    getFontColor: () => string;
    login_id: string;
    server: string;
    variant: TVariant;
};

const AppCardFooter = ({ broker, card_labels, getFontColor, login_id, server, variant }: TAppCardFooterProps) => (
    <div
        className={classNames('dc-app-card-footer__wrapper', {
            'dc-app-card-footer__wrapper--default': variant === 'default',
            'dc-app-card-footer__wrapper--mini': variant === 'mini',
            'dc-app-card-footer__wrapper--micro': variant === 'micro',
        })}
    >
        <AppCardFooterItem info={login_id} getFontColor={getFontColor} label={card_labels.LOGIN_ID} />
        <AppCardFooterItem info={broker} getFontColor={getFontColor} label={card_labels.BROKER} />
        <AppCardFooterItem info={server} getFontColor={getFontColor} label={card_labels.SERVER} />
    </div>
);

export default AppCardFooter;
