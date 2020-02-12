import classNames from 'classnames';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import { VariableSizeList as List } from 'react-window';
import { NavLink } from 'react-router-dom';
import { ThemedScrollbars } from '@deriv/components';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import DataListCell from './data-list-cell.jsx';

const ListScrollbar = React.forwardRef((props, ref) => <ExtendedScrollbars {...props} forwardedRef={ref} />);

// Display name is required by Developer Tools to give a name to the components we use.
// If a component doesn't have a displayName is will be shown as <Unknown />. Hence, name is set.
ListScrollbar.displayName = 'ListScrollbar';

const ExtendedScrollbars = ({ onScroll, forwardedRef, style, children }) => {
    const refSetter = useCallback(scrollbarsRef => {
        if (scrollbarsRef) {
            forwardedRef(scrollbarsRef.view);
        } else {
            forwardedRef(null);
        }
    }, []);

    return (
        <ThemedScrollbars ref={refSetter} style={{ ...style, overflow: 'hidden' }} onScroll={onScroll} autoHide>
            {children}
        </ThemedScrollbars>
    );
};

class DataList extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            height: 200,
            width: 200,
        };
    }

    componentDidMount() {
        this.setState({
            height: this.props.custom_height || this.el_table_body.clientHeight,
            width: this.props.custom_width || this.el_table_body.clientWidth,
        });
    }

    rowRenderer = ({ style, ...args }) => {
        const { data_source, rowRenderer, getRowAction } = this.props;
        const item = data_source[args.index];
        const to = getRowAction && getRowAction(item);
        const contract_id = item.contract_id || item.id;
        return typeof to === 'string' ? (
            <NavLink
                id={`dt_reports_contract_${contract_id}`}
                className={'data-list__item--wrapper'}
                to={{
                    pathname: to,
                    state: {
                        from_table_row: true,
                    },
                }}
                style={style}
            >
                <div className='data-list__item'>{rowRenderer({ ...args })}</div>
            </NavLink>
        ) : (
            <div className='data-list__item--wrapper' style={style}>
                <div className='data-list__item'>{rowRenderer({ ...args })}</div>
            </div>
        );
    };

    render() {
        const { className, children, data_source, getRowSize, is_empty, onScroll } = this.props;

        return (
            <div
                className={classNames(className, 'data-list')}
                ref={ref => (this.el_table_body = ref)}
                onScroll={onScroll}
            >
                <List
                    className={className}
                    height={this.state.height}
                    itemCount={data_source.length}
                    itemSize={getRowSize}
                    width={this.state.width}
                    outerElementType={is_empty ? null : ListScrollbar}
                >
                    {this.rowRenderer}
                </List>
                {children}
            </div>
        );
    }
}
DataList.Cell = DataListCell;
DataList.propTypes = {
    className: PropTypes.string,
    data_source: MobxPropTypes.arrayOrObservableArray,
    getRowAction: PropTypes.func,
    getRowSize: PropTypes.func,
    rowRenderer: PropTypes.func,
};

export default DataList;
