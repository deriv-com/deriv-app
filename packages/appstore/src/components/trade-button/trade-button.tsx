import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { Actions } from 'Components/containers/trading-app-card-actions';
import React from 'react';
import { Link } from 'react-router-dom';
import { useStores } from 'Stores';

const TradeButton = ({ link_to, onAction }: Pick<Actions, 'link_to' | 'onAction'>) => {
    const { traders_hub, modules } = useStores();
    const { is_demo } = traders_hub;
    const { dxtrade_tokens } = modules.cfd;
    const REAL_DXTRADE_URL = 'https://dx.deriv.com';
    const DEMO_DXTRADE_URL = 'https://dx-demo.deriv.com';

    if (link_to) {
        return (
            <Link to={link_to}>
                <Button primary>{localize('Trade')}</Button>
            </Link>
        );
    } else if (onAction) {
        return (
            <Button primary className='trade-button' onClick={() => onAction()}>
                {localize('Trade')}
            </Button>
        );
    }

    return (
        <a
            className='dc-btn trade-button'
            type='button'
            href={`${is_demo ? DEMO_DXTRADE_URL : REAL_DXTRADE_URL}${
                dxtrade_tokens.real ? `?${dxtrade_tokens.real}` : ''
            }`}
            target='_blank'
            rel='noopener noreferrer'
        >
            <Button primary className='trade-button'>
                {localize('Trade')}
            </Button>
        </a>
    );
};

export default TradeButton;
