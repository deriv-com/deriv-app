import React from 'react';
import { Div100vhContainer } from '@deriv/components';
import { isDesktop, getAuthenticationStatusInfo } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { connect } from '../Stores/connect';
import CFDPOA, { TCFDPOAProps } from '../Components/cfd-poa';
import CFDPOI from '../Components/cfd-poi';
import { LandingCompany, ResidenceList, GetSettings, StatesList, GetAccountStatus } from '@deriv/api-types';
import RootStore from '../Stores/index';

type TAuthenticationStatus = { document_status: string; identity_status: string };

type TStoreProofOfAddressArgs = {
    file_uploader_ref: HTMLDivElement | null;
    values: { [key: string]: string };
};

type TRemoveNotificationMessage = {
    key: string;
    should_show_again: boolean;
};

type TGetSettings = GetSettings & {
    upload_file?: string;
    poi_state?: string;
};

type TCFDFinancialStpRealAccountSignupProps = {
    addNotificationByKey: (key: string) => void;
    authentication_status: TAuthenticationStatus;
    get_settings: TGetSettings;
    client_email: string;
    context: RootStore;
    is_fully_authenticated: boolean;
    landing_company: LandingCompany;
    refreshNotifications: () => void;
    removeNotificationMessage: () => void;
    removeNotificationByKey: (args: TRemoveNotificationMessage) => void;
    residence_list: ResidenceList;
    states_list: StatesList;
    storeProofOfAddress: TStoreProofOfAddressArgs;
    fetchStatesList: () => void;
    account_status: GetAccountStatus;
    onFinish: () => void;
    jurisdiction_selected_shortcode: string;
};

type TNextStep = (index: number, value: { [key: string]: string | undefined }) => void;

type TItemsState = {
    header: { [key: string]: string };
    body: ({ onSave, index, onSubmit, refreshNotifications, ...props }: TCFDPOAProps) => JSX.Element;
    form_value: { [key: string]: string | undefined };
    forwarded_props: Array<Partial<keyof TCFDFinancialStpRealAccountSignupProps>>;
};

const CFDFinancialStpRealAccountSignup = (props: TCFDFinancialStpRealAccountSignupProps) => {
    const { account_status, authentication_status, fetchStatesList, refreshNotifications } = props;
    const [step, setStep] = React.useState(0);
    const [form_error, setFormError] = React.useState('');
    const state_index = step;
    const height = 'auto';
    let is_mounted = React.useRef(true).current;

    const { need_poi_for_vanuatu, need_poi_for_bvi_labuan_maltainvest } = getAuthenticationStatusInfo(account_status);

    const poi_config: TItemsState = {
        header: {
            active_title: localize('Complete your proof of identity'),
            title: localize('Proof of identity'),
        },
        body: CFDPOI,
        form_value: {
            poi_state: 'unknown',
        },
        forwarded_props: [
            'addNotificationByKey',
            'authentication_status',
            'refreshNotifications',
            'removeNotificationMessage',
            'removeNotificationByKey',
            'jurisdiction_selected_shortcode',
        ],
    };

    const poa_config: TItemsState = {
        header: {
            active_title: localize('Complete your proof of address'),
            title: localize('Proof of address'),
        },
        body: CFDPOA,
        form_value: {
            address_line_1: props.get_settings.address_line_1,
            address_line_2: props.get_settings.address_line_2,
            address_city: props.get_settings.address_city,
            address_state: props.get_settings.address_state,
            address_postcode: props.get_settings.address_postcode,
            upload_file: '',
        },
        forwarded_props: ['states_list', 'get_settings', 'storeProofOfAddress', 'refreshNotifications'],
    };

    const should_show_poi = () => {
        if (props.jurisdiction_selected_shortcode === 'vanuatu' && need_poi_for_vanuatu) {
            return true;
        }
        return need_poi_for_bvi_labuan_maltainvest;
    };
    const should_show_poa = !(
        authentication_status.document_status === 'pending' || authentication_status.document_status === 'verified'
    );
    const verification_configs = [...(should_show_poi() ? [poi_config] : []), ...(should_show_poa ? [poa_config] : [])];

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

    const BodyComponent = getCurrent('body') as typeof CFDPOI & typeof CFDPOA;
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
            className='cfd-financial-stp-modal'
            id='real_mt5_financial_stp_account_opening'
            is_disabled={isDesktop()}
            height_offset='40px'
        >
            <div className='cfd-financial-stp-modal__body' data-testid='dt_cfd_financial_stp_modal_body'>
                <BodyComponent
                    value={form_value}
                    index={state_index}
                    onSubmit={nextStep}
                    height={height}
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

export default connect(({ client, modules: { cfd }, notifications }: RootStore) => ({
    addNotificationByKey: notifications.addNotificationMessageByKey,
    authentication_status: client.authentication_status,
    get_settings: client.account_settings,
    client_email: client.email,
    is_fully_authenticated: client.is_fully_authenticated,
    landing_company: client.landing_company,
    refreshNotifications: notifications.refreshNotifications,
    removeNotificationMessage: notifications.removeNotificationMessage,
    removeNotificationByKey: notifications.removeNotificationByKey,
    residence_list: client.residence_list,
    states_list: client.states_list,
    fetchStatesList: client.fetchStatesList,
    storeProofOfAddress: cfd.storeProofOfAddress,
    account_status: client.account_status,
    jurisdiction_selected_shortcode: cfd.jurisdiction_selected_shortcode,
}))(CFDFinancialStpRealAccountSignup);
