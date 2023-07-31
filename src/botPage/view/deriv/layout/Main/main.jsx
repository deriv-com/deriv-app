import React from 'react';
import Helmet from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TrackJS } from 'trackjs';
import { getRelatedDeriveOrigin, queryToObjectArray } from '@utils';
import { translate } from '@i18n';
import { getClientAccounts, isDone, getLanguage, getTourState } from '@storage';
import { loginAndSetTokens } from '../../../../../common/appId';
import { observer as globalObserver } from '../../../../../common/utils/observer';
import Blockly from '../../../blockly';
import LogTable from '../../../LogTable';
import TradeInfoPanel from '../../../TradeInfoPanel';
import initialize, { applyToolboxPermissions } from '../../blockly-worksace';
import SidebarToggle from '../../components/SidebarToggle';
import { updateActiveAccount, updateIsLogged } from '../../store/client-slice';
import { setAccountSwitcherLoader, setShouldReloadWorkspace, updateShowTour } from '../../store/ui-slice';
import BotUnavailableMessage from '../Error/bot-unavailable-message-page';
import ToolBox from '../ToolBox';
import useQuery from '../../../../../hooks/useQuery';

const Main = () => {
    const [blockly, setBlockly] = React.useState(null);
    const [is_workspace_rendered, setIsWorkspaceRendered] = React.useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { should_reload_workspace } = useSelector(state => state.ui);
    const query_object = useQuery();

    React.useEffect(() => {
        const new_blockly = new Blockly();
        setBlockly(new_blockly);
        init(new_blockly);
        loginCheck()
            .then(() => initializeBlockly(new_blockly))
            .then(() => setIsWorkspaceRendered(new_blockly?.is_workspace_rendered));
        dispatch(setShouldReloadWorkspace(false));
        // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        if (should_reload_workspace && blockly) {
            globalObserver.emit('bot.reload');
            dispatch(setShouldReloadWorkspace(false));
            applyToolboxPermissions();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [should_reload_workspace]);

    const init = () => {
        const local_storage_sync = document.getElementById('localstorage-sync');
        if (local_storage_sync) {
            local_storage_sync.src = `${getRelatedDeriveOrigin().origin}/localstorage-sync.html`;
        }

        const days_passed = Date.now() > (getTourState() || 0) + 24 * 60 * 60 * 1000;

        dispatch(updateShowTour(isDone('welcomeFinished') || days_passed));
    };

    // eslint-disable-next-line arrow-body-style
    const loginCheck = async () => {
        return new Promise(resolve => {
            const token_list = queryToObjectArray(query_object) || [];
            if (token_list?.length && token_list[0]?.token) {
                navigate('/', { replace: true });
            } else {
                const client_accounts = getClientAccounts();
                Object.keys(client_accounts).forEach(accountName => {
                    token_list.push({
                        accountName,
                        cur: client_accounts[accountName].currency,
                        token: client_accounts[accountName].token,
                    });
                });
            }
            loginAndSetTokens(token_list)
                .then(({ account_info = {} }) => {
                    if (account_info?.loginid) {
                        dispatch(updateIsLogged(true));
                        dispatch(updateActiveAccount(account_info));
                        applyToolboxPermissions();
                    } else {
                        dispatch(updateIsLogged(false));
                    }
                })
                .catch(() => {
                    dispatch(updateIsLogged(false));
                })
                .finally(() => {
                    resolve();
                    dispatch(setAccountSwitcherLoader(false));
                });
        });
    };

    const initializeBlockly = _blockly =>
        initialize(_blockly).then(() => {
            $('.show-on-load').show();
            $('.barspinner').hide();
            window.dispatchEvent(new Event('resize'));
            const userId = document.getElementById('active-account-name')?.value;
            if (userId) {
                TrackJS.configure({ userId });
            }
            return _blockly.initPromise;
        });

    return (
        <div className='main'>
            <Helmet
                htmlAttributes={{
                    lang: getLanguage(),
                }}
                title={translate('Bot trading |  Automated trading system – Deriv')}
                defer={false}
                meta={[
                    {
                        name: 'description',
                        content: translate(
                            'Automate your trades with Deriv’s bot trading platform, no coding needed. Trade now on forex, synthetic indices, commodities, stock indices, and more.'
                        ),
                    },
                ]}
            />
            <BotUnavailableMessage />
            <div id='bot-blockly'>
                {blockly && <ToolBox blockly={blockly} is_workspace_rendered={is_workspace_rendered} />}
                {/* Blockly workspace will be injected here */}
                <div id='blocklyArea'>
                    <div id='blocklyDiv' style={{ position: 'absolute' }}></div>
                    <SidebarToggle />
                </div>
                {blockly && <LogTable />}
                {blockly && <TradeInfoPanel />}
            </div>
        </div>
    );
};

export default Main;
