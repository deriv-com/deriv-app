import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

export default class TableRowInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showDetails: false,
        };
    }

    toggleDetails = () => {
        if (this.props.replace) {
            this.setState(state => ({ showDetails: !state.showDetails }));
        }
    };

    render() {
        return (
            <div
                onClick={this.props.is_footer || !this.props.replace ? undefined : this.toggleDetails}
                className={classNames(this.props.className, { 'statement__row--detail': this.state.showDetails })}
            >
                {
                    this.state.showDetails ?
                        <div>
                            {this.props.replace.component ?
                                this.props.replace.component
                                :
                                <p>{this.props.replace.message}</p>
                            }
                        </div>
                        : this.props.cells
                }
            </div>
        );
    }
}

TableRowInfo.propTypes = {
    cells    : PropTypes.arrayOf(PropTypes.node),
    className: PropTypes.string,
    replace  : PropTypes.object,
};
