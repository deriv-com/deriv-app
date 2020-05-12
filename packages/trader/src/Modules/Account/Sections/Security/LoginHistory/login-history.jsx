// import PropTypes        from 'prop-types';
import React from 'react';
import Loading from '../../../../../templates/app/components/loading.jsx';
import { connect } from 'Stores/connect';
import { DesktopWrapper, MobileWrapper } from '@deriv/components';
import DataTable from 'App/Components/Elements/DataTable';
import { getLoginHistoryColumnsTemplate } from '../../../Constants/data-table-constants';
import LoadErrorMessage from '../../ErrorMessages/LoadErrorMessage';

class LoginHistory extends React.Component {
    state = {
        is_loading: true,
        limit: 12,
        data: [],
        //     {
        //         date: '2019-07-09 10:01:28 GMT',
        //         action: 'Login',
        //         browser: 'Chrome v75.0.3770.100',
        //         ip: '211.24.114.86',
        //         status: 'successful'
        //     },
        //     {
        //         date: '2019-07-09 10:01:28 GMT',
        //         action: 'logout',
        //         browser: 'Chrome v75.0.3770.100',
        //         ip: '211.24.114.86',
        //         status: 'Successful'
        //     },
        //     {
        //         date: '2019-07-09 10:01:28 GMT',
        //         action: 'login',
        //         browser: 'Mozila v75.0.3770.100',
        //         ip: '211.24.114.86',
        //         status: 'successful'
        //     },
        //     {
        //         date: '2019-07-09 10:01:28 GMT',
        //         action: 'Login',
        //         browser: 'Chrome v75.0.3770.100',
        //         ip: '817.24.114.86',
        //         status: 'Successful'
        //     },
        //     {
        //         date: '2019-07-09 10:01:28 GMT',
        //         action: 'Login',
        //         browser: 'Chrome v75.0.3770.100',
        //         ip: '211.24.114.86',
        //         status: 'failed'
        //     },
        // ]
    };

    componentDidMount() {
        this.props.onMount(this.state.limit);
    }

    componentDidUpdate() {
        if (this.props.login_history && this.state.is_loading) {
            const feed = [];
            for (let i = 0; i < this.state.limit; i++) {
                feed[i] = new Object();
                let environment_data = this.props.login_history[i].environment.split(' ');
                let date_time = new Date(this.props.login_history[i].time).toISOString();
                feed[i].date = `${date_time.slice(0, 10)} ${date_time.slice(11, 19)} GMT`;
                feed[i].action = this.props.login_history[i].action;
                feed[i].browser = environment_data[4].split('=')[1];
                feed[i].ip = environment_data[2].split('=')[1];
                feed[i].status = this.props.login_history[i] === 1 ? 'Success' : 'Failure';
            }
            this.setState({
                is_loading: false,
                data: feed,
            });
        }
    }

    render() {
        if (this.props.is_switching) return <Loading />;
        if (this.state.is_loading) return <Loading is_fullscreen={false} className='account___intial-loader' />;

        const { api_initial_load_error } = this.props.login_history;
        if (api_initial_load_error) return <LoadErrorMessage error_message={api_initial_load_error} />;

        this.columns = getLoginHistoryColumnsTemplate();

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
                            <h1>Hello World</h1>
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
