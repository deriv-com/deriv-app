import React from 'react';
import { routes } from '@deriv/shared';
import { useHistory } from 'react-router-dom';
import { PageOverlay } from '@deriv/components';

const DerivezWebTerminal = () => {
    const history = useHistory();
    const routeToPrevious = () => history.push(routes.traders_hub);

    return (
        <PageOverlay
            header='   '
            onClickClose={routeToPrevious}
            content_classname='dc-page-overlay__content--derivez-web-terminal'
        >
            <iframe src='https://dqwsqxuu0r6t9.cloudfront.net/' width='100%' height='100%' />
        </PageOverlay>
    );
};

export default DerivezWebTerminal;
