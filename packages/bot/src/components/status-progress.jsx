import React from 'react';
import PropTypes from 'prop-types';
import { translate } from '../utils/tools';

class StatusProgress extends React.PureComponent {
    constructor(props) {
        super(props);

        const { status } = props;

        this.state = {
            status,
        };
    }

    getStatusDetail = status => {
        let buy_stage_class = '';
        let succeed_stage_class = '';
        let closed_stage_class = '';
        let status_string = '';
    
        switch (status) {
            case 'buy':
                status_string = translate('Attempting to Buy');
                buy_stage_class = 'active';
                break;
            case 'succeed':
                status_string = translate('Buy Succeeded');
                buy_stage_class = 'completed';
                succeed_stage_class = 'active';
                break;
            case 'closed':
                status_string = translate('Contract Closed');
                buy_stage_class = succeed_stage_class = 'completed';
                closed_stage_class = 'active';
                break;
            default:
                status_string = translate('Bot is not running');
                break;
        }

        this.setState({ buy_stage_class, succeed_stage_class, closed_stage_class, status_string });
    }

    componentDidMount () {
        const { status } = this.props;
        this.getStatusDetail(status);
    }

    componentDidUpdate(prev_state) {
        const { status } = this.props;

        if (prev_state !== this.props) {
            this.setState({ ...this.props });
            this.getStatusDetail(status);
        }
    }

    render() {
        const {
            status,
            buy_stage_class,
            succeed_stage_class,
            closed_stage_class,
            status_string,
        } = this.state;

        return (
            <div className='toolbar__group toolbar__group-progress'>
                <span className='toolbar__group-text'>
                    {status_string}
                </span>
                <div className='toolbar__progress'>
                    <div className='toolbar__progress-line' >
                        <div className={`toolbar__progress-bar toolbar__progress-${status}`} />
                    </div>
                    <div className={`circular-wrapper ${buy_stage_class}`} >
                        <span className='static-circle' />
                        <span className='dynamic-circle' />
                    </div>
                    <div className={`circular-wrapper ${succeed_stage_class}`} >
                        <span className='static-circle' />
                        <span className='dynamic-circle' />
                    </div>
                    <div className={`circular-wrapper ${closed_stage_class}`} >
                        <span className='static-circle' />
                        <span className='dynamic-circle' />
                    </div>
                </div>
            </div>
        );
    }
}

StatusProgress.propTypes = {
    status: PropTypes.string,
};

export default StatusProgress;
