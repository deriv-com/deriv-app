import React, { useEffect } from 'react';
import { useCreateAdvertiser } from '@deriv/api';

//just added a test route/page to work with the hooks and test stuffs. will remove it later
const TestPage = () => {
    const { data, createAdvertiser, isUserAuthorized } = useCreateAdvertiser();

    // useEffect(() => {
    //     console.log(data);
    // }, [data]);

    return (
        <div style={{ fontSize: 16, minHeight: '400px', backgroundColor: '#eee', padding: 10 }}>
            <h1 style={{ fontWeight: 'Bold' }}>Test Page</h1>
            <button
                onClick={() => {
                    createAdvertiser({ name: 'advertiser1' });
                }}
            >
                Create Advertiser
            </button>
            <div> User is Authorized: {isUserAuthorized ? 'YES' : 'NO'}</div>
        </div>
    );
};

export default TestPage;
