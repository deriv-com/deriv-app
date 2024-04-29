import React, { useEffect, useState } from 'react';
import { fetchTrustpilotData } from 'Helpers';
import { TTrustpilotWidgetData } from 'Types';

const TrustpilotWidget = () => {
    const [trustpilotData, setTrustpilotData] = useState<TTrustpilotWidgetData>();

    useEffect(() => {
        const getTrustpilotData = async () => {
            const res = await fetchTrustpilotData();
            setTrustpilotData(res);
        };

        getTrustpilotData();
    }, []);

    if (!trustpilotData) return null;

    return <div>Custom widget</div>;
};

export default TrustpilotWidget;
