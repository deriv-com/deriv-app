import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { DesktopWrapper, MobileWrapper, Loading, DataTable } from '@deriv/components';
import { parseUA } from '@deriv/shared/utils/browser';
import { convertDateFormat } from '@deriv/shared/utils/date';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { WS } from 'Services/ws-methods';
import LoadErrorMessage from 'Components/load-error-message';

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
                <Td title={fields.date} text={login_history.date} />
            </tr>
            <tr>
                <Td title={fields.browser} text={login_history.browser} />
                <Td className='action' title={fields.action} text={login_history.action} />
            </tr>
            <tr>
                <Td title={fields.ip} text={login_history.ip} />
                <Td title={fields.status} text={login_history.status} />
            </tr>
        </tbody>
    </table>
);

class LoginHistory extends React.Component {
    fields = {
        date: localize('Date and time'),
        action: localize('Action'),
        browser: localize('Browser'),
        ip: localize('IP address'),
        status: localize('Status'),
    };

    state = {
        is_loading: true,
        fetch_limit: 12, // TODO: put it in constants or configs
        error: '',
        data: [],
    };

    getLoginHistoryColumnsTemplate = () =>
        Object.keys(this.fields).map((key) => ({ title: this.fields[key], col_index: key }));

    getFormattedData(login_history) {
        const data = [];
        for (let i = 0; i < this.state.fetch_limit; i++) {
            data[i] = {};
            const environment = login_history[i].environment;
            const environment_split = environment.split(' ');
            const date = environment_split[0];
            const time = environment_split[1].replace('GMT', '');
            const date_time = convertDateFormat(`${date} ${time}`, 'D-MMMM-YY hh:mm:ss', 'YYYY-MM-DD hh:mm:ss');
            data[i].date = `${date_time} GMT`;
            data[i].action = login_history[i].action;
            const user_agent = environment.substring(environment.indexOf('User_AGENT'), environment.indexOf('LANG'));
            const ua = parseUA(user_agent);
            data[i].browser = ua ? `${ua.name} ${ua.version}` : '';
            data[i].ip = environment_split[2].split('=')[1];
            data[i].status = login_history[i].status === 1 ? localize('Successful') : localize('Failed');
            data[i].id = i;
        }
        return data;
    }

    static getLoginHistory(limit) {
        return new Promise((resolve) => {
            WS.authorized.loginHistory(limit).then((data) => {
                if (data.error) resolve({ api_initial_load_error: data.error.message });
                resolve(data);
            });
        });
    }

    async componentDidMount() {
        const api_res = await LoginHistory.getLoginHistory(this.state.fetch_limit);
        if (api_res.api_initial_load_error) {
            this.setState({
                is_loading: false,
                error: api_res.api_initial_load_error,
            });
        } else {
            const formated_data = this.getFormattedData(api_res.login_history);
            this.setState({
                is_loading: false,
                data: formated_data,
            });
        }
    }

    render() {
        if (this.props.is_switching) return <Loading />;
        if (this.state.is_loading) return <Loading is_fullscreen={false} className='account___intial-loader' />;

        if (this.state.error) return <LoadErrorMessage error_message={this.state.error} />;

        const columns = this.getLoginHistoryColumnsTemplate();
        const row_size = () => 36;

        return (
            <section className='login-history-container'>
                {this.state.data?.length > 0 ? (
                    <>
                        <DesktopWrapper>
                            <DataTable
                                className='login-history-table'
                                data_source={this.state.data}
                                columns={columns}
                                custom_width={'100%'}
                                getRowSize={row_size}
                            />
                        </DesktopWrapper>
                        <MobileWrapper>
                            {this.state.data.map((item) => (
                                <LoginHistoryListView key={item.id} fields={this.fields} login_history={item} />
                            ))}
                        </MobileWrapper>
                    </>
                ) : null}
            </section>
        );
    }
}

LoginHistory.propTypes = {
    is_switching: PropTypes.bool,
};

export default connect(({ client }) => ({
    is_switching: client.is_switching,
}))(LoginHistory);
