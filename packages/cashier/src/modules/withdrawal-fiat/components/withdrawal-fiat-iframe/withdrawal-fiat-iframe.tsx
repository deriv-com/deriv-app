import React from 'react';
import { Loading } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useWithdrawalFiatAddress } from '@deriv/hooks';

const WithdrawalFiatIframe = observer(() => {
    const { data: iframe_url, isSuccess } = useWithdrawalFiatAddress();
    const [is_loading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        setIsLoading(true);
    }, [iframe_url]);

    return (
        <React.Fragment>
            {is_loading && <Loading />}
            {isSuccess && (
                <iframe
                    key={iframe_url}
                    onLoad={() => setIsLoading(false)}
                    src={iframe_url}
                    style={{ display: is_loading ? 'none' : 'block' }}
                />
            )}
        </React.Fragment>
    );
});

export default WithdrawalFiatIframe;
