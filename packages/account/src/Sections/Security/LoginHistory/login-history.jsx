import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { DesktopWrapper, MobileWrapper, Loading, DataTable, Table } from '@deriv/components';
import Bowser from 'bowser';
import { convertDateFormat } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { WS } from 'Services/ws-methods';
import LoadErrorMessage from 'Components/load-error-message';

const CellContent = ({ title, text, className }) => (
    <React.Fragment>
        <h3 className='cell-title'>{title}</h3>
        <p className={classNames('cell-value', className)}>{text}</p>
    </React.Fragment>
);

const LoginHistoryListView = ({ fields, login_history }) => (
    <Table className='login-history-table'>
        <Table.Body>
            <Table.Row className='with-margin'>
                <Table.Cell>
                    <CellContent title={fields.date} text={login_history.date} />
                </Table.Cell>
            </Table.Row>
            <Table.Row className='with-margin'>
                <Table.Cell>
                    <CellContent className='browser' title={fields.browser} text={login_history.browser} />
                </Table.Cell>
                <Table.Cell>
                    <CellContent className='action' title={fields.action} text={login_history.action} />
                </Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>
                    <CellContent className='ip-value' title={fields.ip} text={login_history.ip} />
                </Table.Cell>
                <Table.Cell>
                    <CellContent title={fields.status} text={login_history.status} />
                </Table.Cell>
            </Table.Row>
        </Table.Body>
    </Table>
);

const fetch_limit = 50;

class LoginHistory extends React.Component {
    state = {
        is_loading: true,
        error: '',
        data: [],
    };

    getFields = () => ({
        date: localize('Date and time'),
        action: localize('Action'),
        browser: localize('Browser'),
        ip: localize('IP address'),
        status: localize('Status'),
    });

    getLoginHistoryColumnsTemplate = () => {
        const fields = this.getFields();
        return Object.keys(fields).map(key => ({ title: fields[key], col_index: key }));
    };

    static getFormattedData(login_history) {
        const data = [];
        const real_fetch_limit = Math.min(fetch_limit, login_history.length);
        for (let i = 0; i < real_fetch_limit; i++) {
            data[i] = {};
            const environment = login_history[i].environment;
            const environment_split = environment.split(' ');
            const date = environment_split[0];
            const time = environment_split[1].replace('GMT', '');
            const date_time = convertDateFormat(`${date} ${time}`, 'D-MMMM-YY hh:mm:ss', 'YYYY-MM-DD hh:mm:ss');
            data[i].date = `${date_time} GMT`;
            data[i].action = login_history[i].action;
            const user_agent = environment.substring(environment.indexOf('User_AGENT'), environment.indexOf('LANG'));
            const ua = Bowser.getParser(user_agent)?.getBrowser();
            data[i].browser = ua ? `${ua.name} v${ua.version}` : localize('Unknown');
            data[i].ip = environment_split[2].split('=')[1];
            data[i].status = login_history[i].status === 1 ? localize('Successful') : localize('Failed');
            data[i].id = i;
        }
        return data;
    }

    static getLoginHistory(limit) {
        return new Promise(resolve => {
            WS.authorized.loginHistory(limit).then(data => {
                if (data.error) resolve({ api_initial_load_error: data.error.message });
                resolve(data);
            });
        });
    }

    async componentDidMount() {
        const api_res = await LoginHistory.getLoginHistory(fetch_limit);
        if (api_res.api_initial_load_error) {
            this.setState({
                is_loading: false,
                error: api_res.api_initial_load_error,
            });
        } else {
            const formatted_data = LoginHistory.getFormattedData(api_res.login_history);
            this.setState({
                is_loading: false,
                data: formatted_data,
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
                            {this.state.data.map(item => (
                                <LoginHistoryListView key={item.id} fields={this.getFields()} login_history={item} />
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
