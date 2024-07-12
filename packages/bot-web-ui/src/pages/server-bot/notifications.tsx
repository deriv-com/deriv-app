import React from 'react';
import { observer } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';

const Notifications = observer(() => {
    const { server_bot } = useDBotStore();
    const { notifications } = server_bot;

    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        scrollToTopOfElement();
    }, [notifications.length]);

    const scrollToTopOfElement = () => {
        const element = document.querySelector('server-bot-notifications');
        if (element) {
            // Using scrollIntoView with 'start' to align to the bottom because of column-reverse
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div id='server-bot-notifications' className='server-bot__notifications'>
            {notifications?.map((notification: string, index: number) => {
                return (
                    <div key={index} className='server-bot__notifications__notification'>
                        {notification}
                    </div>
                );
            })}
        </div>
    );
});

export default Notifications;
