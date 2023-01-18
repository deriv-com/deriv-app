import { ThemedScrollbars } from '@deriv/components';
import { isDesktop, isMobile } from '@deriv/shared';
import React from 'react';
import ApiTokenArticle from './api-token.article';
import ApiTokenForm from './api-token-form';
import ApiTokenTable from './api-token-table';
import ApiTokenProvider from './api-token.provider';
import ApiTokenSection from './api-token.section';
import { TAuthorizedSocket } from '../../../../core/src/_common/base/ts_socket_base';

export type TApiToken = {
    is_app_settings: boolean;
    is_switching: boolean;
    ws: TAuthorizedSocket;
};

const ApiToken = ({ is_app_settings, is_switching, ws }: TApiToken) => {
    return (
        <ApiTokenProvider ws={ws}>
            <ApiTokenSection is_app_settings={is_app_settings} is_switching={is_switching}>
                <ThemedScrollbars className='da-api-token__scrollbars' is_bypassed={isMobile()}>
                    {!is_app_settings && isMobile() && <ApiTokenArticle />}
                    <ApiTokenForm />
                    <ApiTokenTable is_switching={is_switching} />
                </ThemedScrollbars>
                {!is_app_settings && isDesktop() && <ApiTokenArticle />}
            </ApiTokenSection>
        </ApiTokenProvider>
    );
};

export default ApiToken;
