import React, { createContext, Dispatch, ReactNode, useEffect, useState } from 'react';
import type { WebsiteStatus } from '@deriv/api-types';
import { useCookieState } from '@deriv/hooks';
import { WS } from '@deriv/shared';
import { TSocketEndpointNames, TSocketResponseData } from '@deriv/api/types';

type WebsiteStatusProviderProps = {
    children?: ReactNode;
};

type WebsiteStatusContextType = {
    setWebsiteStatus: Dispatch<WebsiteStatus | void>;
    website_status: WebsiteStatus;
};

export const WebsiteStatusContext = createContext<WebsiteStatusContextType>(null);

export const WebsiteStatusProvider = <T extends TSocketEndpointNames>({ children }: WebsiteStatusProviderProps) => {
    let data: TSocketResponseData<T>;
    const WEBSITE_STATUS_COUNTRY_KEY = 'website_status';
    const [days_from_today, setDaysFromToday] = useState(new Date());

    useEffect(() => {
        const date = new Date();
        setDaysFromToday(date.getDate() + 7);
    }, []);

    const [websiteCountryStatus, setWebsiteStatus] = useCookieState(WEBSITE_STATUS_COUNTRY_KEY, {
        expires: days_from_today,
    });

    WS.authorized.send({ website_status: 1 }).then(response => {
        data = response.website_status;

        const { clients_country } = data;
        setWebsiteStatus(oldVal => ({ clients_country, ...oldVal }));
    });

    return (
        <WebsiteStatusContext.Provider
            value={{
                setWebsiteStatus,
                website_status: websiteCountryStatus,
            }}
        >
            {children}
        </WebsiteStatusContext.Provider>
    );
};
