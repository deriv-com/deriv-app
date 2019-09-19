import React            from 'react';
import PropTypes        from 'prop-types';
import { translate }    from '../utils/tools';
import                       '../assets/sass/scratch/animation.scss';

const CONTRACT_STATUS = [
    'Bot is not running',
    'Attempting to Buy',
    'Buy Succeeded',
    'Closing Contract',
    'Contract Closed',
];

class AnimateTrade extends React.PureComponent {
    constructor(props) {
        super(props);

        const { status } = props;

        this.state = {
            status,
            status_class: ['', '', ''],
        };
    }

    getStatusDetail = status => {
        const progress_status = status - 1;

        const status_string = CONTRACT_STATUS[status];
        const status_class = ['', '', ''];

        status_class[progress_status] = status === 0 ? '' : 'active';
        for (let i = 0; i < progress_status; i++) {
            status_class[i] = 'completed';
        }

        this.setState({ status_class, status_string });
    }

    componentDidMount() {
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
            status_string,
            status_class,
        } = this.state;

        return (
            <div className='animation__container'>
                <span className='animation__text'>
                    {translate(status_string)}
                </span>
                <div className='animation__progress'>
                    <div className='animation__progress-line' >
                        <div className={`animation__progress-bar animation__progress-${status}`} />
                    </div>
                    <div className={`circular-wrapper ${status_class[0]}`} >
                        <span className='static-circle' />
                        <span className='dynamic-circle' />
                    </div>
                    <div className={`circular-wrapper ${status_class[1]}`} >
                        <span className='static-circle' />
                        <span className='dynamic-circle' />
                    </div>
                    <div className={`circular-wrapper ${status_class[2]}`} >
                        <span className='static-circle' />
                        <span className='dynamic-circle' />
                    </div>
                </div>
            </div>
        );
    }
}

AnimateTrade.propTypes = {
    status: PropTypes.number,
};

export default AnimateTrade;
