import React                from 'react';
import PropTypes            from 'prop-types';
import * as config          from './help-content.config';
import FlyoutVideo          from './help-components/flyout-video.jsx';
import FlyoutText           from './help-components/flyout-text.jsx';
import FlyoutImage          from './help-components/flyout-img.jsx';
import FlyoutBlock          from '../../components/flyout-block.jsx';
import { connect }          from '../../stores/connect';
import { translate }        from '../../utils/tools';

class HelpBase extends React.PureComponent {
    constructor(props) {
        super(props);
        const { onSequenceClick, block_nodes } = props;

        this.state = {
            onSequenceClick,
            block_nodes,
            help_string     : null,
            has_help_content: true,
        };
    }

    getHelpString = block_nodes => {
        const block_type = block_nodes[0].getAttribute('type');
        const title = Blockly.Blocks[block_type].meta().display_name;

        import(`./help-string/${block_type}.json`)
            .then(help_string => {
                this.setState({ help_string, has_help_content: true });
            })
            .catch(() => this.setState({ has_help_content: false }));

        this.setState({ title, block_type });
    }

    componentDidMount() {
        const { block_nodes } = this.props;
        this.getHelpString(block_nodes);
    }

    componentDidUpdate(prev_state) {
        const { block_nodes } = this.props;

        if (prev_state !== this.props) {
            this.setState({ ...this.props });
            this.getHelpString(block_nodes);
        }
    }

    render() {
        const {
            onSequenceClick,
            block_type,
            title,
            block_nodes,
            help_string,
            has_help_content,
        } = this.state;
        const block_config = help_string && config[block_type];
        const component_order = block_config && block_config.order;

        return (
            <React.Fragment>
                <div className='flyout__help-header'>
                    <button className='flyout__button flyout__button-back' onClick={() => Blockly.derivWorkspace.reshowFlyout()}>⬅</button>
                    <span className='flyout__help-title'>{title}</span>
                </div>
                <div className='flyout__help-content'>
                    {
                        block_config &&
                        component_order.map(component => {
                            switch (component) {
                                case 'description':
                                    return (
                                        <FlyoutText text={help_string.description} />
                                    );
                                case 'explanation':
                                    return (
                                        <FlyoutText text={help_string.explanation} />
                                    );
                                case 'video':
                                    return (
                                        <FlyoutVideo url={block_config.video_url} />
                                    );
                                case 'image':
                                    return (
                                        <FlyoutImage url={block_config.img_url} />
                                    );
                                case 'block':
                                {
                                    return Object.keys(block_nodes).map(key => {
                                        return (
                                            <FlyoutBlock
                                                key={key}
                                                should_center_block={true}
                                                block_node={block_nodes[key]}
                                            />
                                        );
                                    });
                                }
                                default:
                                    return null;
                            }
                        })
                    }
                    {
                        !has_help_content &&
                        <div className='flyout__item'>
                            <h3>Coming soon...</h3>
                        </div>
                    }
                </div>
                <div className='flyout__help-footer'>
                    <button className='flyout__button flyout__button-previous' onClick={() => onSequenceClick(block_type, false)}>{translate('Previous')}</button>
                    <button className='flyout__button flyout__button-next' onClick={() => onSequenceClick(block_type, true)}>{translate('Next')}</button>
                </div>
            </React.Fragment >
        );
    }
}

HelpBase.propTypes = {
    block_nodes    : PropTypes.array,
    onSequenceClick: PropTypes.func,
    title          : PropTypes.string,
};

export default connect(({ flyout }) => ({
    onSequenceClick: flyout.onSequenceClick,
}))(HelpBase);
