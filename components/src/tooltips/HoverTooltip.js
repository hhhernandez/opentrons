// @flow

import * as React from 'react'
import { Manager, Reference, Popper } from 'react-popper'
import styles from './tooltips.css'

const OPEN_DELAY_MS = 300
const CLOSE_DELAY_MS = 150
const DISTANCE_FROM_REFERENCE = 4

type PopperProps = React.ElementProps<typeof Popper>
type Props = {
  tooltipComponent: React.Node,
  placement?: $PropertyType<PopperProps, 'placement'>,
  children: React.Node
}
type State = {isOpen: boolean}
class HoverTooltip extends React.Component<Props, State> {
  openTimeout: ?TimeoutID
  closeTimeout: ?TimeoutID

  constructor (props: Props) {
    super(props)
    this.openTimeout = null
    this.closeTimeout = null
    this.state = {isOpen: false}
  }

  delayedOpen = () => {
    if (this.closeTimeout) clearTimeout(this.closeTimeout)
    this.openTimeout = setTimeout(() => this.setState({isOpen: true}), OPEN_DELAY_MS)
  }
  delayedClose = () => {
    if (this.openTimeout) clearTimeout(this.openTimeout)
    this.closeTimeout = setTimeout(() => this.setState({isOpen: false}), CLOSE_DELAY_MS)
  }

  render () {
    return (
      <Manager>
        <Reference>
          {({ref}) => (
            <div
              ref={ref}
              className={styles.hover_wrapper}
              onMouseEnter={this.delayedOpen}
              onMouseLeave={this.delayedClose}>
              {this.props.children}
            </div>
          )}
        </Reference>
        {
          this.state.isOpen &&
          <Popper placement={this.props.placement} modifiers={{offset: {offset: `0, ${DISTANCE_FROM_REFERENCE}`}}}>
            {({ref, style, placement}) => (
              <div ref={ref} className={styles.tooltip_box} style={style} data-placement={placement}>
                {this.props.tooltipComponent}
              </div>
            )}
          </Popper>
        }
      </Manager>
    )
  }
}

export default HoverTooltip
