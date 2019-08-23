import React from 'react';
import PropTypes from 'prop-types';
import * as config from './help-content.config';
import FlyoutVideo from './help-components/flyout-video.jsx';
import FlyoutText from './help-components/flyout-text.jsx';
import FlyoutImage from './help-components/flyout-img.jsx';
import FlyoutBlockWorkspace from '../../components/flyout-block-workspace.jsx';
import { connect } from '../../stores/connect';

class HelpBase extends React.Component {
    constructor(props) {
        super(props);
        const { onSequenceClick, nodes } = props;

        this.state = {
            onSequenceClick,
            nodes,
            help_string    : null,
            no_help_content: false,
        };
    }

    getHelpString = async nodes => {
        this.setState({ no_help_content: false });

        const block_type = nodes[0].getAttribute('type');
        const title = Blockly.Blocks[block_type].meta().display_name;
        const help_string = await import(`./help-string/${block_type}.json`)
            .catch(() => this.setState({ no_help_content: true }));

        this.setState({ help_string, title, block_type });
    }

    componentDidMount() {
        const { nodes } = this.state;
        this.getHelpString(nodes);
    }

    componentWillReceiveProps(new_props) {
        const { nodes } = new_props;
        if (this.state !== new_props) {
            this.setState({ ...new_props });
        }

        this.getHelpString(nodes);
    }

    render() {
        const { onSequenceClick, block_type, title, nodes, help_string, no_help_content } = this.state;
        const block_config = help_string && config[block_type];
        const component_order = block_config && block_config.order;

        return (
            <React.Fragment>
                <div className='flyout__help-header'>
                    <button className='flyout__item-btn flyout__item-btn-back' onClick={() => Blockly.derivWorkspace.reshowFlyout()}>⬅</button>
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
                                    return Object.keys(nodes).map(key => {
                                        return (
                                            <FlyoutBlockWorkspace
                                                key={key}
                                                should_center_block={true}
                                                block_node={nodes[key]}
                                            />
                                        );
                                    });
                                }
                                default:
                                    return <></>;
                            }
                        })
                    }
                    {
                        no_help_content &&
                        <div className='flyout_item'>
                            <h3>Coming soon...</h3>
                        </div>
                    }
                </div>
                <div className='flyout__help-footer'>
                    <button className='flyout__item-btn flyout__item-btn-previous' onClick={() => onSequenceClick(block_type, 'previous')}>Previous</button>
                    <button className='flyout__item-btn flyout__item-btn-next' onClick={() => onSequenceClick(block_type, 'next')}>Next</button>
                </div>
            </React.Fragment >
        );
    }
}

HelpBase.propTypes = {
    nodes          : PropTypes.any,
    onSequenceClick: PropTypes.func,
    title          : PropTypes.string,
};

export default connect(({ flyout }) => ({
    onSequenceClick: flyout.onSequenceClick,
}))(HelpBase);
