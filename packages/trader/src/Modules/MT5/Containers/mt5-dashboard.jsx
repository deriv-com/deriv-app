import {
    Button,
    Tabs,
    Modal,
    Popover,
    Input,
    PasswordMeter,
    Money }                    from 'deriv-components';
import {
    Field,
    Formik,
    Form }                     from 'formik';
import React                   from 'react';
import DataTable               from 'App/Components/Elements/DataTable';
import Localize                from 'App/Components/Elements/localize.jsx';
import UILoader                from 'App/Components/Elements/ui-loader.jsx';
import Tooltip                 from 'App/Containers/Mt5/tooltip.jsx';
import TopUpVirtualModal       from 'App/Containers/Mt5/top-up-virtual-modal.jsx';
import { localize }            from 'App/i18n';
import IconInfoOutline         from 'Assets/Common/icon-info-outline.jsx';
import IconClipboard           from 'Assets/Mt5/icon-clipboard.jsx';
// import IconMT5Advanced                  from 'Assets/SvgComponents/mt5/accounts-display/icon-mt5-advanced.svg';
import IconMT5Standard         from 'Assets/SvgComponents/mt5/accounts-display/icon-mt5-standard.svg';
import IconMT5Synthetic        from 'Assets/SvgComponents/mt5/accounts-display/icon-mt5-synthetic.svg';
import IconDeviceLaptop        from 'Assets/SvgComponents/mt5/download-center/icon-device-laptop.svg';
import IconDeviceMac           from 'Assets/SvgComponents/mt5/download-center/icon-device-mac.svg';
import IconDeviceMobile        from 'Assets/SvgComponents/mt5/download-center/icon-device-mobile.svg';
import IconInstallationApple   from 'Assets/SvgComponents/mt5/download-center/icon-installation-apple.svg';
import IconInstallationGoogle  from 'Assets/SvgComponents/mt5/download-center/icon-installation-google.svg';
import IconInstallationLinux   from 'Assets/SvgComponents/mt5/download-center/icon-installation-linux.svg';
import IconInstallationMac     from 'Assets/SvgComponents/mt5/download-center/icon-installation-mac.svg';
import IconInstallationWindows from 'Assets/SvgComponents/mt5/download-center/icon-installation-windows.svg';
import { connect }             from 'Stores/connect';
import {
    validLength,
    validPassword }            from 'Utils/Validator/declarative-validation-rules';
import Loading                 from '../../../templates/_common/components/loading.jsx';
import 'Sass/app/modules/mt5-dashboard.scss';

/*
*  [Work In Progress]
*  This file is a WIP and will be broken down into different files for different components before the module is enabled
*  Class names might change, component structures might change, and content and icons will definitely change
* */
class ClipboardComponent extends React.PureComponent {
    copyToClipboard = (text) => {
        const textField     = document.createElement('textarea');
        textField.innerText = text;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy');
        textField.remove();
    };

    onClick = () => {
        this.copyToClipboard(this.props.text);
        this.setState({
            copied: true,
        });
        setTimeout(() => {
            this.setState({
                copied: false,
            });
        }, 2000);
    };

    render() {
        return (
            <React.Fragment>
                {!this.state.copied &&
                <Tooltip
                    message={localize('Click here to copy account login number and paste into the login box in MT5 platform along with your password.')}
                >
                    <IconClipboard
                        className='mt5-account-card__clipboard'
                        key='1'
                        onClick={this.onClick}
                    />
                </Tooltip>
                }
                {this.state.copied &&
                <Tooltip
                    message={localize('Account login number copied!')}
                >
                    <IconInfoOutline className='mt5-account-card__clipboard' />
                </Tooltip>
                }
            </React.Fragment>
        );
    }

    state = {
        copied: false,
    };
}

const MT5AccountCard = ({
    commission_message,
    descriptor,
    existing_data,
    icon,
    has_mt5_account,
    specs,
    title,
    type,
    onSelectAccount,
    onClickFund,
    onPasswordManager,
}) => {
    const IconComponent = icon || (() => null);

    return (
        <div className='mt5-account-card'>
            <div className='mt5-account-card__type'>
                {icon &&
                <IconComponent />
                }
                <div className='mt5-account-card__type--description'>
                    <h1 className='mt5-account-card--heading'>
                        {title}
                    </h1>
                    {!existing_data &&
                    <p className='mt5-account-card--paragraph'>
                        {descriptor}
                    </p>
                    }
                    {existing_data && existing_data.display_balance &&
                    <p className='mt5-account-card--balance'>
                        <Money
                            amount={existing_data.display_balance}
                            currency={existing_data.currency}
                        />
                    </p>
                    }
                </div>
            </div>

            <div className='mt5-account-card__cta'>
                {existing_data && existing_data.login &&
                <div className='mt5-account-card__login'>
                    <Localize
                        i18n_default_text='Account login no.&nbsp;<0>{{login}}</0>'
                        values={{
                            login: existing_data.login,
                        }}
                        components={[
                            <strong key='0' />,
                        ]}
                    />
                    <ClipboardComponent text={existing_data.login} />
                </div>
                }
                <div className='mt5-account-card__specs'>
                    <table className='mt5-account-card__specs-table'>
                        <tbody>
                            {
                                Object.keys(specs).map((spec_attribute, idx) => (
                                    <tr key={idx} className='mt5-account-card__specs-table-row'>
                                        <td className='mt5-account-card__specs-table-attribute'>
                                            <p className='mt5-account-card--paragraph'>
                                                {spec_attribute}
                                            </p>
                                        </td>
                                        <td className='mt5-account-card__specs-table-data'>
                                            <p className='mt5-account-card--paragraph'>
                                                {specs[spec_attribute]}
                                            </p>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>

                {!existing_data && commission_message &&
                <p className='mt5-account-card__commission mt5-account-card--paragraph'>
                    {commission_message}
                </p>
                }
                {existing_data &&
                <div className='mt5-account-card__manage'>
                    <Button
                        onClick={onClickFund}
                        className='btn--secondary--default'
                        type='button'
                    >
                        {type.category === 'real' &&
                        <Localize i18n_default_text='Fund transfer' />
                        }
                        {type.category === 'demo' &&
                        <Localize i18n_default_text='Top up' />
                        }
                    </Button>
                    <Button
                        onClick={ () => { onPasswordManager(existing_data.login); } }
                        className='btn--secondary--default'
                        type='button'
                    >
                        <Localize i18n_default_text='Password' />
                    </Button>
                </div>
                }

                {!existing_data && has_mt5_account &&
                <Button
                    className='mt5-account-card__account-selection'
                    onClick={() => { onSelectAccount(type); }}
                    type='button'
                >
                    <Localize i18n_default_text='Select' />
                </Button>
                }
                {existing_data &&
                <a
                    className='btn mt5-account-card__account-selection mt5-account-card__account-selection--primary'
                    type='button'
                    href='https://trade.mql5.com/trade?servers=Binary.com-Server&trade_server=Binary.com-Server'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <Localize i18n_default_text='Trade now' />
                </a>
                }
                {!existing_data && !has_mt5_account &&
                <Button
                    className='mt5-account-card__account-selection mt5-account-card__account-selection--secondary'
                    onClick={() => { onSelectAccount(type); }}
                    type='button'
                >
                    <Localize i18n_default_text='Create account' />
                </Button>
                }
            </div>
        </div>
    );
};

const RealAccountsDisplay = ({
    is_loading,
    onSelectAccount,
    openAccountTransfer,
    current_list,
    has_mt5_account,
    openPasswordManager,
}) => (is_loading ? (
    <div className='mt5-real-accounts-display'>
        <Loading />
    </div>
) : (
    <div className='mt5-real-accounts-display'>
        <MT5AccountCard
            has_mt5_account={has_mt5_account}
            icon={() => (<IconMT5Standard />)}
            title={localize('Standard')}
            type={{
                category: 'real',
                type    : 'standard',
            }}
            existing_data={current_list['real.standard']}
            commission_message={
                <Localize
                    i18n_default_text='No commission <0>(excluding cryptocurrencies)</0>'
                    components={[<span key={0} className='mt5-dashboard--hint' />]}
                />
            }
            onSelectAccount={onSelectAccount}
            onPasswordManager={openPasswordManager}
            onClickFund={() => openAccountTransfer(current_list['real.standard'], {
                category: 'real',
                type    : 'standard',
            })}
            descriptor={localize('Suitable for both new and experienced traders.')}
            specs={{
                [localize('Leverage')]        : localize('Up to 1:1000'),
                [localize('Margin call')]     : localize('150%'),
                [localize('Stop out level')]  : localize('75%'),
                [localize('Number of assets')]: localize('50+'),
            }}
        />
        {/* TODO Bring this back when Real Advanced is implemented */}
        {/* <MT5AccountCard
            has_mt5_account={has_mt5_account}
            icon={() => (<IconMT5Advanced />)}
            title={localize('Advanced')}
            type={{
                category: 'real',
                type    : 'advanced',
            }}
            existing_data={current_list['real.advanced']}
            commission_message={<Localize i18n_default_text='No commission' />}
            onSelectAccount={onSelectAccount}
            onPasswordManager={openPasswordManager}
            onClickFund={() => openAccountTransfer(current_list['real.advanced'], {
                category: 'real',
                type    : 'advanced',
            })}
            descriptor={localize('Give you more products, tight spreads, and higher ticket size.')}
            specs={{
                [localize('Leverage')]        : localize('Up to 1:100'),
                [localize('Margin call')]     : localize('150%'),
                [localize('Stop out level')]  : localize('75%'),
                [localize('Number of assets')]: localize('50+'),
            }}
        /> */}
        <MT5AccountCard
            has_mt5_account={has_mt5_account}
            icon={() => (<IconMT5Synthetic />)}
            title={localize('Synthetic Indices')}
            type={{
                category: 'real',
                type    : 'synthetic_indices',
            }}
            existing_data={current_list['real.synthetic_indices']}
            commission_message={<Localize i18n_default_text='No commission' />}
            onSelectAccount={onSelectAccount}
            onPasswordManager={openPasswordManager}
            onClickFund={() => openAccountTransfer(current_list['real.synthetic_indices'], {
                category: 'real',
                type    : 'synthetic_indices',
            })}
            descriptor={localize('Trade CFDs on our Synthetic Indices that simulate real-world market movement.')}
            specs={{
                [localize('Leverage')]        : localize('Up to 1:1000'),
                [localize('Margin call')]     : localize('100%'),
                [localize('Stop out level')]  : localize('50%'),
                [localize('Number of assets')]: localize('10+'),
            }}
        />
    </div>
));

const DemoAccountsDisplay = ({
    is_loading,
    onSelectAccount,
    openAccountTransfer,
    current_list,
    has_mt5_account,
    openPasswordManager,
}) => (is_loading ? (
    <div className='mt5-demo-accounts-display'>
        <Loading />
    </div>
) : (
    <div className='mt5-demo-accounts-display'>
        <MT5AccountCard
            has_mt5_account={has_mt5_account}
            icon={() => (<IconMT5Standard />)}
            title={localize('Standard')}
            type={{
                category: 'demo',
                type    : 'standard',
            }}
            existing_data={current_list['demo.standard']}
            commission_message={
                <Localize
                    i18n_default_text='No commission <0>(excluding cryptocurrencies)</0>'
                    components={[<span key={0} className='mt5-dashboard--hint' />]}
                />
            }
            onSelectAccount={onSelectAccount}
            onPasswordManager={openPasswordManager}
            onClickFund={() => openAccountTransfer(current_list['demo.standard'], {
                category: 'demo',
                type    : 'standard',
            })}
            descriptor={localize('Suitable for both new and experienced traders.')}
            specs={{
                [localize('Leverage')]        : localize('Up to 1:1000'),
                [localize('Margin call')]     : localize('150%'),
                [localize('Stop out level')]  : localize('75%'),
                [localize('Number of assets')]: localize('50+'),
            }}
        />
        {/* TODO Bring this back when Real Advanced is implemented */}
        {/* <MT5AccountCard
            has_mt5_account={has_mt5_account}
            icon={() => (<IconMT5Advanced />)}
            title={localize('Advanced')}
            type={{
                category: 'demo',
                type    : 'advanced',
            }}
            existing_data={current_list['demo.advanced']}
            commission_message={<Localize i18n_default_text='No commission' />}
            onSelectAccount={onSelectAccount}
            onPasswordManager={openPasswordManager}
            onClickFund={() => openAccountTransfer(current_list['demo.advanced'], {
                category: 'demo',
                type    : 'advanced',
            })}
            descriptor={localize('Give you more products, tight spreads, and higher ticket size.')}
            specs={{
                [localize('Leverage')]        : localize('Up to 1:100'),
                [localize('Margin call')]     : localize('150%'),
                [localize('Stop out level')]  : localize('75%'),
                [localize('Number of assets')]: localize('50+'),
            }}
        /> */}
        <MT5AccountCard
            has_mt5_account={has_mt5_account}
            icon={() => (<IconMT5Synthetic />)}
            title={localize('Synthetic Indices')}
            type={{
                category: 'demo',
                type    : 'synthetic_indices',
            }}
            existing_data={current_list['demo.synthetic_indices']}
            commission_message={<Localize i18n_default_text='No commission' />}
            onSelectAccount={onSelectAccount}
            onPasswordManager={openPasswordManager}
            onClickFund={() => openAccountTransfer(current_list['demo.synthetic_indices'], {
                category: 'demo',
                type    : 'synthetic_indices',
            })}
            descriptor={localize('Trade CFDs on our Synthetic Indices that simulate real-world market movement.')}
            specs={{
                [localize('Leverage')]        : localize('Up to 1:1000'),
                [localize('Margin call')]     : localize('100%'),
                [localize('Stop out level')]  : localize('50%'),
                [localize('Number of assets')]: localize('10+'),
            }}
        />
    </div>
));

/* eslint-disable react/display-name, react/prop-types */
const compareAccountsColumns = [
    {
        title    : '',
        col_index: 'attribute',
    },
    {
        title    : <Localize i18n_default_text='Standard' />,
        col_index: 'standard',
    }, {
        title    : <Localize i18n_default_text='Advanced' />,
        col_index: 'advanced',
    }, {
        title    : <Localize i18n_default_text='Synthetic Indices' />,
        col_index: 'synthetic',
    },
];
/* eslint-enable react/display-name, react/prop-types */

const MT5AttributeDescriber = ({ name, tooltip, counter }) => {
    return tooltip ? (
        <React.Fragment>
            <p className='mt5-attribute-describer'>{name}</p>
            <Popover
                alignment='right'
                icon='counter'
                counter={counter}
                message={tooltip}
            />
        </React.Fragment>
    ) : (
        <p className='mt5-attribute-describer'>{name}</p>
    );
};

const compareAccountsData = [
    {
        attribute: <MT5AttributeDescriber name={ localize('Account currency') } />,
        standard : localize('USD'),
        advanced : localize('USD'),
        synthetic: localize('USD'),
    },
    {
        attribute: (
            <MT5AttributeDescriber
                name={localize('Maximum leverage')}
                counter={1}
                tooltip={localize(
                    'Leverage gives you the ability to trade a larger position using your existing capital. Leverage varies across different symbols.')}
            />
        ),
        standard : localize('Up To 1:1000'),
        advanced : localize('Up To 1:100'),
        synthetic: localize('Up To 1:1000'),
    },
    {
        attribute: (
            <MT5AttributeDescriber
                name={localize('Order execution')}
                counter={2}
                tooltip={localize(
                    'All 3 account types use market execution. This means you agree with the broker\'s price in advance and will place orders at the broker\'s price.')}
            />
        ),
        standard : localize('Market'),
        advanced : localize('Market'),
        synthetic: localize('Market'),
    },
    {
        attribute: (
            <MT5AttributeDescriber
                name={localize('Spread')}
                counter={3}
                tooltip={localize(
                    'The spread is the difference between the buy price and sell price. A variable spread means that the spread is constantly changing, depending on market conditions. A fixed spread remains constant but is subject to alteration, at the Broker\'s absolute discretion.')}
            />
        ),
        standard : localize('Variable'),
        advanced : localize('Variable'),
        synthetic: localize('Fixed/Variable'),
    },
    {
        attribute: (
            <MT5AttributeDescriber
                name={localize('Commission')}
                counter={4}
                tooltip={localize(
                    'Deriv charges no commission across all account types, except cryptocurrency accounts.')}
            />
        ),
        standard : localize('No'),
        advanced : localize('No'),
        synthetic: localize('No'),
    },
    {
        attribute: <MT5AttributeDescriber name={ localize('Minimum deposit') } />,
        standard : localize('No'),
        advanced : localize('No'),
        synthetic: localize('No'),
    },
    {
        attribute: (
            <MT5AttributeDescriber
                name={localize('Margin call')}
                counter={5}
                tooltip={localize(
                    'When the remaining funds in your account is deemed insufficient to cover the leverage or margin requirements, your account will be placed under margin call. To prevent a margin call escalating to a stop out level, you can deposit  additional funds into your account or close any open positions.')}
            />
        ),
        standard : localize('150%'),
        advanced : localize('150%'),
        synthetic: localize('100%'),
    },
    {
        attribute: (
            <MT5AttributeDescriber
                name={localize('Stop out level')}
                counter={6}
                tooltip={localize(
                    'If your account reaches the stop out level, then your account will be in stop out state. Trading positions and orders on your account are forcibly closed until there are no more open positions or until your margin level increases above the stop out level.')}
            />
        ),
        standard : localize('75%'),
        advanced : localize('75%'),
        synthetic: localize('50%'),
    },
    {
        attribute: <MT5AttributeDescriber name={ localize('Number of assets') } />,
        standard : localize('50+'),
        advanced : localize('50+'),
        synthetic: localize('10+'),
    },
    {
        attribute: (
            <MT5AttributeDescriber
                name={localize('Cryptocurrency trading')}
                counter={7}
                tooltip={localize('Indicates the availability of cryptocurrency trading on a particular account.')}
            />
        ),
        standard : localize('24/7'),
        advanced : localize('N/A'),
        synthetic: localize('N/A'),
    },
];

const ModalContent = () => (
    <div className='mt5-compare-accounts'>
        <DataTable
            className='mt5-compare-accounts__data'
            data_source={compareAccountsData}
            columns={compareAccountsColumns}
            item_size={40}
        />
        <p className='mt5-compare-account--hint'>
            <Localize
                i18n_default_text='Note: At bank rollover, liquidity in the forex markets is reduced and may increase the spread and processing time for client orders. This happens around 21:00 GMT during daylight saving time, and 22:00 GMT non-daylight saving time.'
            />
        </p>
    </div>
);

class MT5Dashboard extends React.Component {
    state = {
        password_manager: {
            is_visible    : false,
            selected_login: '',
        },
        // error_message_main: '',
        // error_message_investor: '',
        main: {
            has_error    : false,
            error_message: '',
        },
        investor: {
            has_error    : false,
            error_message: '',
        },
    };

    openAccountTransfer = (data, meta) => {
        if (meta.category === 'real') {
            this.props.toggleAccountTransferModal();
        } else {
            this.props.setCurrentAccount(data, meta);
            this.props.openTopUpModal();
        }
    };

    togglePasswordManagerModal = (login) => {
        this.setState((prev_state) => ({
            password_manager: {
                is_visible    : !prev_state.password_manager.is_visible,
                selected_login: login || '',
            },
        }));
    };

    showError = (section, error_message) => {
        this.setState({
            [section]: {
                has_error: true,
                error_message,
            },
        });
    };

    hideError = (section) => {
        this.setState({
            [section]: {
                has_error    : false,
                error_message: '',
            },
        });
    };

    render() {
        const {
            createMT5Account,
            disableApp,
            enableApp,
            is_compare_accounts_visible,
            is_loading,
            has_mt5_account,
            onSubmitPasswordChange,
            toggleCompareAccounts,
        } = this.props;

        const CompareAccountsModal = () => (
            <div className='mt5-compare-accounts-modal__wrapper'>
                <Button
                    className='btn--tertiary--default mt5-dashboard__welcome-message--button'
                    has_effect
                    text={localize('Compare accounts')}
                    onClick={toggleCompareAccounts}
                />
                <React.Suspense fallback={<UILoader />}>
                    <Modal
                        className='mt5-dashboard__compare-accounts'
                        disableApp={disableApp}
                        enableApp={enableApp}
                        is_open={is_compare_accounts_visible}
                        title={localize('Compare accounts')}
                        toggleModal={toggleCompareAccounts}
                        type='button'
                    >
                        <ModalContent />s
                    </Modal>
                </React.Suspense>
            </div>
        );

        const validatePassword = (values) => {
            const is_valid = validPassword(values.new_password) &&
                validLength(values.new_password, {
                    min: 8,
                    max: 25,
                });
            const errors = {};

            if (!is_valid) {
                errors.new_password = localize('The password must contain at least two of three types of characters (lower case, upper case and digits).');
            }

            if (!values.old_password && values.old_password !== undefined) {
                errors.old_password = localize('This field is required');
            }

            return errors;
        };
        const onSubmit = async (values) => {
            if (!this.state.password_manager.selected_login) {
                return;
            }

            const error = await onSubmitPasswordChange(
                { login: this.state.password_manager.selected_login, ...values }
            );

            if (error) {
                this.showError(values.password_type, error);
            } else {
                this.hideError(values.password_type);
            }
        };

        const MainPasswordManager = () => {
            const initial_values = { old_password: '', new_password: '', password_type: 'main' };

            return (
                <Formik
                    initialValues={ initial_values }
                    validate={ validatePassword }
                    onSubmit={ onSubmit }
                >
                    {({ isSubmitting, errors, setFieldTouched, touched }) => (
                        <Form className='mt5-password-manager__main-form' noValidate>
                            { this.state.main.has_error &&
                                <p className='mt5-password-manager--error-message'>
                                    { this.state.main.error_message }
                                </p>
                            }
                            <Field name='old_password'>
                                {({ field }) => (
                                    <Input
                                        { ...field }
                                        type='password'
                                        label={localize('Current password')}
                                        error={ touched.old_password && errors.old_password }
                                        required
                                    />
                                )}
                            </Field>
                            <Field name='new_password'>
                                {({ field }) => (
                                    <PasswordMeter
                                        input={field.value}
                                        error={touched.new_password && errors.new_password}
                                    >
                                        <Input
                                            { ...field }
                                            autoComplete='password'
                                            label={localize('New password')}
                                            type='password'
                                            onChange={(e) => {
                                                setFieldTouched('new_password', true, true);
                                                field.onChange(e);
                                            }}
                                            required
                                        />
                                    </PasswordMeter>
                                )}
                            </Field>
                            <p className='mt5-password-manager--hint'><Localize i18n_default_text='Strong passwords contain at least 8 characters, combine uppercase and lowercase letters and numbers.' /></p>
                            <div className='mt5-password-manager__actions'>
                                <Button className='mt5-password-manager--button btn--primary--default' is_disabled={ isSubmitting }>
                                    <span className='btn__text'><Localize i18n_default_text='Change password' /></span>
                                </Button>
                                <Button className='mt5-password-manager--button btn--tertiary--default' type='button'>
                                    <span className='btn__text'><Localize i18n_default_text='Reset main password' /></span>
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            );
        };

        const InvestorPasswordManager = () => {
            const initial_values = { old_password: '', new_password: '', password_type: 'investor' };

            return (
                <div className='mt5-password-manager__investor-wrapper'>
                    <p className='mt5-password-manager--paragraph'>
                        <Localize i18n_default_text='Use this password to allow another user to access your account to view your trades. This user will not be able to trade or take any other actions.' />
                    </p>
                    { this.state.investor.has_error &&
                        <p className='mt5-password-manager--error-message'>
                            { this.state.investor.error_message }
                        </p>
                    }
                    <Formik
                        initialValues={ initial_values }
                        validate={ validatePassword }
                        onSubmit={ onSubmit }
                    >
                        {({ isSubmitting, errors, setFieldTouched, touched }) => (
                            <Form className='mt5-password-manager__investor-form' noValidate>
                                <Field name='old_password'>
                                    {({ field }) => (
                                        <Input
                                            { ...field }
                                            type='password'
                                            label={localize('Current investor password')}
                                            error={ touched.old_password && errors.old_password }
                                            required
                                        />
                                    )}
                                </Field>
                                <Field name='new_password'>
                                    {({ field }) => (
                                        <PasswordMeter
                                            input={field.value}
                                            error={touched.new_password && errors.new_password}
                                        >
                                            <Input
                                                { ...field }
                                                autoComplete='password'
                                                label={localize('New investor password')}
                                                type='password'
                                                onChange={(e) => {
                                                    setFieldTouched('new_password', true, true);
                                                    field.onChange(e);
                                                }}
                                                required
                                            />
                                        </PasswordMeter>
                                    )}
                                </Field>
                                <p className='mt5-password-manager--hint'><Localize i18n_default_text='Strong passwords contain at least 8 characters, combine uppercase and lowercase letters and numbers.' /></p>
                                <div className='mt5-password-manager__actions'>
                                    <Button className='mt5-password-manager--button btn--primary--default' is_disabled={ isSubmitting }>
                                        <span className='btn__text'><Localize i18n_default_text='Change investor password' /></span>
                                    </Button>
                                    <Button className='mt5-password-manager--button btn--tertiary--default' type='button'>
                                        <span className='btn__text'><Localize i18n_default_text='Create or reset investor password' /></span>
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            );
        };

        const PasswordManagerModal = () => (
            <React.Suspense fallback={<UILoader />}>
                <Modal
                    className='mt5-password-manager__modal'
                    disableApp={disableApp}
                    enableApp={enableApp}
                    is_open={this.state.password_manager.is_visible}
                    title={localize('Manage your DMT5 Standard real account password')}
                    toggleModal={this.togglePasswordManagerModal}
                >
                    <div className='mt5-password-manager'>
                        <Tabs>
                            <div label={localize('Main password')}>
                                <MainPasswordManager />
                            </div>
                            <div label={localize('Investor password')}>
                                <InvestorPasswordManager />
                            </div>
                        </Tabs>
                    </div>
                </Modal>
            </React.Suspense>
        );

        return (
            <div className='mt5-dashboard'>
                {!has_mt5_account &&
                <div className='mt5-dashboard__welcome-message'>
                    <h1 className='mt5-dashboard__welcome-message--heading'>
                        <Localize i18n_default_text='Welcome to Deriv MetaTrader 5 (MT5)' />
                    </h1>
                    <div className='mt5-dashboard__welcome-message--content'>
                        <p className='mt5-dashboard__welcome-message--paragraph'>
                            <Localize
                                i18n_default_text='MetaTrader 5 (MT5) is a popular online trading platform for forex and stock markets. Get prices and currency quotes, perform analysis using charts and technical indicators, and easily view your trading history.'
                            />
                        </p>
                        <CompareAccountsModal />
                    </div>
                </div>
                }

                <div className='mt5-dashboard__accounts-display'>
                    <PasswordManagerModal />
                    <Tabs>
                        <div label={localize('Real account')}>
                            <RealAccountsDisplay
                                is_loading={ is_loading }
                                current_list={this.props.current_list}
                                has_mt5_account={has_mt5_account}
                                onSelectAccount={createMT5Account}
                                openAccountTransfer={this.openAccountTransfer}
                                openPasswordManager={ this.togglePasswordManagerModal }
                            />
                        </div>
                        <div label={localize('Demo account')}>
                            <DemoAccountsDisplay
                                is_loading={ is_loading }
                                has_mt5_account={has_mt5_account}
                                current_list={this.props.current_list}
                                onSelectAccount={createMT5Account}
                                openAccountTransfer={this.openAccountTransfer}
                                openPasswordManager={ this.togglePasswordManagerModal }
                            />
                        </div>
                    </Tabs>
                </div>
                <div className='mt5-dashboard__download-center'>
                    <h1 className='mt5-dashboard__download-center--heading'>
                        <Localize
                            i18n_default_text='After creating your account, download MT5 for your desktop or mobile'
                        />
                    </h1>

                    <div className='mt5-dashboard__download-center-options'>
                        <div className='mt5-dashboard__download-center-options--desktop'>
                            <div className='mt5-dashboard__download-center-options--desktop-devices'>
                                <IconDeviceMac />
                                <IconDeviceLaptop />
                            </div>
                            <div className='mt5-dashboard__download-center-options--desktop-links'>
                                <IconInstallationWindows />
                                <IconInstallationMac />
                                <IconInstallationLinux />
                            </div>
                        </div>
                        <div className='mt5-dashboard__download-center-options--mobile'>
                            <div className='mt5-dashboard__download-center-options--mobile-devices'>
                                <IconDeviceMobile />
                            </div>
                            <div className='mt5-dashboard__download-center-options--mobile-links'>
                                <IconInstallationApple />
                                <IconInstallationGoogle />
                            </div>
                        </div>
                    </div>
                    <p className='mt5-dashboard__download-center--hint'>
                        <Localize
                            i18n_default_text='The MT5 platform does not support Windows XP, Windows 2003 and Windows Vista.'
                        />
                    </p>
                </div>
                <TopUpVirtualModal />
            </div>
        );
    }
}

export default connect(({ client, modules, ui }) => ({
    createMT5Account           : modules.mt5.createMT5Account,
    disableApp                 : ui.disableApp,
    enableApp                  : ui.enableApp,
    current_list               : modules.mt5.current_list,
    is_compare_accounts_visible: modules.mt5.is_compare_accounts_visible,
    is_loading                 : client.is_populating_mt5_account_list,
    has_mt5_account            : !!modules.mt5.current_list.length,
    setCurrentAccount          : modules.mt5.setCurrentAccount,
    toggleCompareAccounts      : modules.mt5.toggleCompareAccountsModal,
    toggleAccountTransferModal : modules.mt5.toggleAccountTransferModal,
    onSubmitPasswordChange     : modules.mt5.changePassword,
    openTopUpModal             : ui.openTopUpModal,
}))(MT5Dashboard);
