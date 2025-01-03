import React from 'react';
import { withRouter } from 'react-router-dom';

const FrontChannelPage = () => {
    React.useEffect(() => {
        localStorage.removeItem('client.accounts');
    }, []);
    return <></>;
};

export default withRouter(FrontChannelPage);
