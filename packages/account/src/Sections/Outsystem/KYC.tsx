import { observer, useStore } from '@deriv/stores';

const KYC = observer(() => {
    const { client } = useStore();
    const token = client.getToken();
    const appID = localStorage.getItem('config.app_id') as string;
    // const lang = localStorage.getItem("i18n_language")?.toLowerCase() as string
    const server = localStorage.getItem('config.server_url') as string;

    const url = new URL('https://deriv-dev.outsystems.app/Accounts/ProofOfIdentity');
    url.searchParams.append('mode', 'service');
    url.searchParams.append('appid', appID);
    url.searchParams.append('lang', 'en');
    url.searchParams.append('server', server);
    url.searchParams.append('token', token);

    return <iframe src={url.toString()} title='KYC' width='100%' height='100%' style={{ border: 'none' }} />;
});

export default KYC;
