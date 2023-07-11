import React from 'react';
import { Div100vhContainer } from '@deriv/components';
import { isDesktop } from '@deriv/shared';
import { LandingCompany, ResidenceList, GetSettings, StatesList, GetAccountStatus } from '@deriv/api-types';
import { ProofOfIdentityContainer, ProofOfAddressContainer } from '@deriv/account';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';

type TAuthenticationStatus = { document_status: string; identity_status: string };

type TStoreProofOfAddressArgs = {
    file_uploader_ref: HTMLDivElement | null;
    values: { [key: string]: string };
};

type TRoutingHistory = {
    action: string;
    hash: string;
    key: string;
    pathname: string;
    search: string;
}[];

type TRemoveNotificationMessage = {
    key: string;
    should_show_again: boolean;
};

type TGetSettings = GetSettings & {
    upload_file?: string;
    poi_state?: string;
};

type TVerificationModalContent = {
    fetchResidenceList: () => void;
    getChangeableFields: () => void;
    is_mx_mlt: boolean;
    is_switching: boolean;
    is_high_risk: boolean;
    is_withdrawal_lock: boolean;
    should_allow_authentication: boolean;
    is_virtual: boolean;
    updateAccountStatus: () => void;
    is_eu: boolean;
    is_verification_modal_visible: boolean;
    addNotificationMessageByKey: (key: string) => void;
    authentication_status: TAuthenticationStatus;
    account_settings: TGetSettings;
    client_email: string;
    context: RootStore;
    is_fully_authenticated: boolean;
    landing_company: LandingCompany;
    has_restricted_mt5_account: boolean;
    refreshNotifications: () => void;
    removeNotificationMessage: () => void;
    removeNotificationByKey: (args: TRemoveNotificationMessage) => void;
    residence_list: ResidenceList;
    states_list: StatesList;
    storeProofOfAddress: TStoreProofOfAddressArgs;
    fetchStatesList: () => void;
    account_status: GetAccountStatus;
    app_routing_history: TRoutingHistory;
    routeBackInApp: () => void;
    onFinish: () => void;
};

type TNextStep = (index: number, value: { [key: string]: string | undefined }) => void;

type TItemsState = {
    body: typeof ProofOfIdentityContainer | typeof ProofOfAddressContainer;
    form_value: { [key: string]: string | undefined };
    forwarded_props: Array<Partial<keyof TVerificationModalContent>>;
};

const VerificationModalContent = (props: TVerificationModalContent) => {
    const { authentication_status, fetchStatesList, account_settings, refreshNotifications } = props;
    const [step, setStep] = React.useState(0);
    const [form_error, setFormError] = React.useState('');
    const state_index = step;
    let is_mounted = React.useRef(true).current;

    const poi_config: TItemsState = {
        body: ProofOfIdentityContainer,
        form_value: {
            poi_state: 'unknown',
        },
        forwarded_props: [
            'account_status',
            'account_settings',
            'app_routing_history',
            'fetchResidenceList',
            'getChangeableFields',
            'is_switching',
            'is_virtual',
            'is_high_risk',
            'is_withdrawal_lock',
            'refreshNotifications',
            'routeBackInApp',
            'should_allow_authentication',
            'updateAccountStatus',
        ],
    };

    const poa_config: TItemsState = {
        body: ProofOfAddressContainer,
        form_value: {
            address_line_1: account_settings.address_line_1,
            address_line_2: account_settings.address_line_2,
            address_city: account_settings.address_city,
            address_state: account_settings.address_state,
            address_postcode: account_settings.address_postcode,
            upload_file: '',
        },
        forwarded_props: [
            'is_mx_mlt',
            'is_switching',
            'has_restricted_mt5_account',
            'refreshNotifications',
            'app_routing_history',
            'account_settings',
            'addNotificationMessageByKey',
            'is_eu',
            'is_verification_modal_visible',
            'fetchResidenceList',
            'fetchStatesList',
            'removeNotificationByKey',
            'removeNotificationMessage',
            'states_list',
        ],
    };

    const should_show_poi = !['pending', 'rejected'].includes(authentication_status.identity_status);
    const should_show_poa = !['pending', 'verified'].includes(authentication_status.document_status);

    const verification_configs = [...(should_show_poi ? [poi_config] : []), ...(should_show_poa ? [poa_config] : [])];

    const [items, setItems] = React.useState<TItemsState[]>(verification_configs);

    const clearError = () => {
        setFormError('');
    };

    React.useEffect(() => {
        refreshNotifications();
    }, [items, refreshNotifications]);

    React.useEffect(() => {
        fetchStatesList();
    }, [fetchStatesList]);

    const unmount = () => {
        is_mounted = false;
        props.onFinish();
    };

    const saveFormData = (index: number, value: { [key: string]: string | undefined }) => {
        if (!is_mounted) return; // avoiding state update on unmounted component
        const cloned_items: TItemsState[] = [...items];
        cloned_items[index].form_value = value;
        setItems(cloned_items);
    };

    const nextStep: TNextStep = (index, value) => {
        clearError();
        if (step + 1 < items.length) {
            saveFormData(index, value);
            setStep(step + 1);
        } else unmount();
    };

    const prevStep = () => {
        if (step - 1 >= 0) {
            setStep(step - 1);
            setFormError('');
        } else unmount();
    };

    const getCurrent = (key?: keyof TItemsState) => {
        return key ? items[state_index][key] : items[state_index];
    };

    const BodyComponent = getCurrent('body') as typeof ProofOfIdentityContainer | typeof ProofOfAddressContainer;

    const form_value = getCurrent('form_value');

    const passthrough = ((getCurrent('forwarded_props') || []) as TItemsState['forwarded_props']).reduce(
        (forwarded_prop, item) => {
            return Object.assign(forwarded_prop, {
                [item]: props[item],
            });
        },
        {}
    );

    return (
        <Div100vhContainer
            className='proof-of-identity'
            id='verification_modal_content'
            is_disabled={isDesktop()}
            height_offset='40px'
        >
            <div className='proof-of-identity__main-container' data-testid='dt_verification_modal_body'>
                <BodyComponent
                    value={form_value}
                    index={state_index}
                    onSubmit={nextStep}
                    height='auto'
                    context={props.context}
                    onCancel={prevStep}
                    onSave={saveFormData}
                    form_error={form_error}
                    {...passthrough}
                />
            </div>
        </Div100vhContainer>
    );
};

export default connect(({ client, notifications, common, ui }: RootStore) => ({
    fetchResidenceList: client.fetchResidenceList,
    getChangeableFields: client.getChangeableFields,
    is_switching: client.is_switching,
    is_high_risk: client.is_high_risk,
    is_withdrawal_lock: client.is_withdrawal_lock,
    should_allow_authentication: client.should_allow_authentication,
    is_virtual: client.is_virtual,
    updateAccountStatus: client.updateAccountStatus,
    has_restricted_mt5_account: client.has_restricted_mt5_account,
    is_mx_mlt: client.landing_company_shortcode === 'iom' || client.landing_company_shortcode === 'malta',
    is_eu: client.is_eu,
    is_verification_modal_visible: ui.is_verification_modal_visible,
    addNotificationMessageByKey: notifications.addNotificationMessageByKey,
    authentication_status: client.authentication_status,
    account_settings: client.account_settings,
    client_email: client.email,
    is_fully_authenticated: client.is_fully_authenticated,
    landing_company: client.landing_company,
    refreshNotifications: notifications.refreshNotifications,
    removeNotificationMessage: notifications.removeNotificationMessage,
    removeNotificationByKey: notifications.removeNotificationByKey,
    residence_list: client.residence_list,
    states_list: client.states_list,
    fetchStatesList: client.fetchStatesList,
    account_status: client.account_status,
    app_routing_history: common.app_routing_history,
    routeBackInApp: common.routeBackInApp,
}))(VerificationModalContent);
