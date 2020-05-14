// import PropTypes        from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { DesktopWrapper, MobileWrapper } from '@deriv/components';
import { convertDateFormat } from '@deriv/shared/utils/date';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import DataTable from 'App/Components/Elements/DataTable';
import Loading from '../../../../../templates/app/components/loading.jsx';
import LoadErrorMessage from '../../ErrorMessages/LoadErrorMessage';

const Td = ({ title, text, className }) => (
    <td>
        <h3 className='cell-title'>{title}</h3>
        <span className={classNames('cell-value', className)}>{text}</span>
    </td>
);

const LoginHistoryListView = ({ fields, login_history }) => (
    <table className='login-history-table'>
        <tbody>
            <tr>
                <Td title={fields[0].value} text={login_history[fields[0].key]} />
            </tr>
            <tr>
                <Td title={fields[2].value} text={login_history[fields[2].key]} />
                <Td className={fields[1].key} title={fields[1].value} text={login_history[fields[1].key]} />
            </tr>
            <tr>
                <Td title={fields[3].value} text={login_history[fields[3].key]} />
                <Td title={fields[4].value} text={login_history[fields[4].key]} />
            </tr>
        </tbody>
    </table>
);

const parseUA = user_agent => {
    const lookup = [
        { name: 'Edge', regex: /(?:edge|edga|edgios|edg)\/([\d\w.-]+)/i },
        { name: 'SeaMonkey', regex: /seamonkey\/([\d\w.-]+)/i },
        { name: 'Opera', regex: /(?:opera|opr)\/([\d\w.-]+)/i },
        { name: 'Chromium', regex: /(?:chromium|crios)\/([\d\w.-]+)/i },
        { name: 'Chrome', regex: /chrome\/([\d\w.-]+)/i },
        { name: 'Safari', regex: /version\/([\d\w.-]+)/i },
        { name: 'IE', regex: /msie\s([\d.]+[\d])/i },
        { name: 'IE', regex: /trident\/\d+\.\d+;.*[rv:]+(\d+\.\d)/i },
        { name: 'Firefox', regex: /firefox\/([\d\w.-]+)/i },
        { name: 'Binary app', regex: /binary\.com V([\d.]+)/i },
    ];
    for (let i = 0; i < lookup.length; i++) {
        const info = lookup[i];
        const match = user_agent.match(info.regex);
        if (match !== null) {
            return {
                name: info.name,
                version: match[1],
            };
        }
    }
    return null;
};

class LoginHistory extends React.Component {
    // data keys+values
    fields = [
        {
            key: 'date',
            value: localize('Date and time'),
        },
        {
            key: 'action',
            value: localize('Action'),
        },
        {
            key: 'browser',
            value: localize('Browser'),
        },
        {
            key: 'ip',
            value: localize('IP address'),
        },
        {
            key: 'status',
            value: localize('Status'),
        },
    ];
    // state
    state = {
        is_loading: true,
        fetch_limit: 12, // TODO: put it in constants or configs
        data: [],
    };
    // methods
    getLoginHistoryColumnsTemplate = () =>
        this.fields.map(item => ({
            title: localize(item.value),
            col_index: item.key,
        }));
    getFormattedData() {
        const data = [];
        for (let i = 0; i < this.state.fetch_limit; i++) {
            data[i] = {};
            const environment = this.props.login_history[i].environment;
            const environment_split = environment.split(' ');
            const date = environment_split[0];
            const time = environment_split[1].replace('GMT', '');
            const date_time = convertDateFormat(`${date} ${time}`, 'D-MMMM-YY hh:mm:ss', 'YYYY-MM-DD hh:mm:ss');
            data[i][this.fields[0].key] = `${date_time} GMT`;
            data[i][this.fields[1].key] = this.props.login_history[i][this.fields[1].key];
            const user_agent = environment.substring(environment.indexOf('User_AGENT'), environment.indexOf('LANG'));
            const ua = parseUA(user_agent);
            data[i][this.fields[2].key] = ua ? `${ua.name} ${ua.version}` : '';
            data[i][this.fields[3].key] = environment_split[2].split('=')[1];
            data[i][this.fields[4].key] =
                this.props.login_history[i][this.fields[4].key] === 1 ? localize('Success') : localize('Failure');
            data[i].id = i;
        }
        return data;
    }
    // lifecycle methods
    componentDidMount() {
        this.props.onMount(this.state.fetch_limit);
    }

    componentDidUpdate() {
        if (this.props.login_history && this.state.is_loading) {
            const formated_data = this.getFormattedData();
            this.setState({
                is_loading: false,
                data: formated_data,
            });
        }
    }

    render() {
        if (this.props.is_switching) return <Loading />;
        if (this.state.is_loading) return <Loading is_fullscreen={false} className='account___intial-loader' />;

        const { api_initial_load_error } = this.props.login_history;
        if (api_initial_load_error) return <LoadErrorMessage error_message={api_initial_load_error} />;

        this.columns = this.getLoginHistoryColumnsTemplate();

        return (
            <section className='login-history-container'>
                {this.state.data && this.state.data.length > 0 ? (
                    <>
                        <DesktopWrapper>
                            <DataTable
                                className='login-history-table'
                                data_source={this.state.data}
                                columns={this.columns}
                                custom_width={'100%'}
                                getRowSize={() => 36}
                            />
                        </DesktopWrapper>
                        <MobileWrapper>
                            {this.state.data.map(item => (
                                <LoginHistoryListView key={item.id} fields={this.fields} login_history={item} />
                            ))}
                        </MobileWrapper>
                    </>
                ) : null}
            </section>
        );
    }
}

// LoginHistory.propTypes = {};

export default connect(({ client }) => ({
    is_switching: client.is_switching,
    login_history: client.login_history,
    onMount: client.getLoginHistory,
}))(LoginHistory);
