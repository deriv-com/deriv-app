import classNames       from 'classnames';
import React            from 'react';
import PropTypes        from 'prop-types';
import { translate }    from '../utils/tools';
import                       '../assets/sass/trade-animation.scss';

const CONTRACT_STATUS = [
    'Bot is not running',
    'Attempting to Buy',
    'Buy Succeeded',
    'Closing Contract',
    'Contract Closed',
];

const CircularWrapper = ({ className }) => (
    <div className={classNames(
        'circular-wrapper',
        { [className]: !!className }
    )}
    >
        <span className='static-circle' />
        <span className='dynamic-circle' />
    </div>
);

class TradeAnimation extends React.PureComponent {
    constructor(props) {
        super(props);

        const { className, status } = props;

        this.state = {
            className,
            status,
            status_class: ['', '', ''],
            
        };
    }

    getStatusDetail = status => {
        const progress_status = status - 1;

        const status_string = CONTRACT_STATUS[status];
        const status_class = ['', '', ''];

        if (progress_status >= 0 && progress_status < 3) {
            status_class[progress_status] = 'active';
        }

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
            className,
            status_string,
            status_class,
        } = this.state;
        
        return (
            <div className={classNames(
                'animation__container',
                {
                    [className]         : !!className,
                    'animation--running': status > 0,
                },
            )}
            >
                <span className='animation__text'>
                    {translate(status_string)}
                </span>
                <div className='animation__progress'>
                    <div className='animation__progress-line' >
                        <div className={`animation__progress-bar animation__progress-${status}`} />
                    </div>
                    {
                        status_class.map((status_c, index) => {
                            return <CircularWrapper key={index} className={status_c} />;
                        })
                    }
                </div>
            </div>
        );
    }
}

TradeAnimation.propTypes = {
    status: PropTypes.number,
};

export default TradeAnimation;
