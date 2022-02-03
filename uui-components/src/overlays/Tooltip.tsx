import * as React from 'react';
import { Placement, Boundary } from '@popperjs/core';
import { Manager, Reference, Popper, PopperChildrenProps } from 'react-popper';
import type { Options } from '@popperjs/core/lib/modifiers/offset';
import { uuiElement, IHasCX, LayoutLayer, IHasChildren, closest, cx, UuiContext } from '@epam/uui';
import * as css from './Tooltip.scss';
import { PopperTargetWrapper } from './PopperTargetWrapper';
import { Portal } from './Portal';

export interface TooltipProps extends IHasCX, IHasChildren {
    content?: any;
    renderContent?(): any;
    placement?: Placement;
    trigger?: 'click' | 'press' | 'hover';
    portalTarget?: HTMLElement;
    offset?: Options['offset'];
    children?: React.ReactNode;
    boundaryElement?: Boundary;
}

export interface TooltipState {
    isOpen: boolean;
}

export class Tooltip extends React.Component<TooltipProps, TooltipState> {
    public static contextType = UuiContext;

    private layer: LayoutLayer | null = null;
    private node: HTMLElement = null;

    state: TooltipState = { isOpen: false };

    constructor(props: TooltipProps) {
        super(props);
    }

    mouseEnterHandler = (e: MouseEvent) => this.setState({ isOpen: true });
    mouseLeaveHandler = (e: MouseEvent) => this.setState({ isOpen: false });
    mouseUpHandler = (e: Event) => this.setState({ isOpen: false });
    mouseDownHandler = (e: MouseEvent) => this.setState({ isOpen: !this.state.isOpen });

    mouseClickHandler = (e: MouseEvent) => {
        if (closest((e.target as HTMLElement), this.node)) {
            this.setState({ isOpen: !this.state.isOpen });
        } else {
            this.setState({ isOpen: false });
        }
    }

    attachHandlers(node?: HTMLElement) {
        if (!node) return;

        switch (this.props.trigger) {
            case 'click': {
                node.addEventListener('click', this.mouseClickHandler);
                break;
            }

            case 'press': {
                node.addEventListener('mousedown', this.mouseDownHandler);
                node.addEventListener('mouseup', this.mouseUpHandler);
                break;
            }

            default: {
                node.addEventListener('mouseenter', this.mouseEnterHandler);
                node.addEventListener('mouseleave', this.mouseLeaveHandler);
                break;
            }
        }
    }

    detachHandlers(node: HTMLElement, prevProps: TooltipProps) {
        if (!node) return;

        switch (prevProps.trigger) {
            case 'click': {
                node.removeEventListener('click', this.mouseClickHandler);
                break;
            }

            case 'press': {
                node.removeEventListener('mousedown', this.mouseDownHandler);
                node.removeEventListener('mouseup', this.mouseUpHandler);
                break;
            }

            default: {
                node.removeEventListener('mouseenter', this.mouseEnterHandler);
                node.removeEventListener('mouseleave', this.mouseLeaveHandler);
                break;
            }
        }
    }

    componentDidMount() {
        if (!this.node) return;
        this.layer = this.context?.uuiLayout?.getLayer();
        this.attachHandlers(this.node);
    }

    componentDidUpdate(prevProps: TooltipProps): void {
        if (prevProps.trigger !== this.props.trigger) {
            this.detachHandlers(this.node, prevProps);
            this.attachHandlers(this.node);
        }
    }

    componentWillUnmount() {
        this.detachHandlers(this.node, this.props);
        this.layer && this.context.uuiLayout?.releaseLayer(this.layer);
    }

    private renderTooltip = () => (
        <div role="tooltip" aria-hidden={ this.isTooltipExist() } className={ uuiElement.tooltipBody }>
            { this.props.content || this.props.renderContent?.() }
        </div>
    );

    private renderTooltipBody = ({ ref, placement, style, arrowProps, isReferenceHidden }: PopperChildrenProps) => {
        if (isReferenceHidden && this.state.isOpen) {
            // Yes, we know that it's hack and we can perform setState in render, but we don't have other way to do it in this case
            setTimeout(() => { this.setState({ isOpen: false }); }, 0);
            return null;
        }
        return (
            <div
                ref={ ref }
                style={ { ...style, zIndex: this.layer?.zIndex } }
                className={ cx(this.props.cx, css.container, uuiElement.tooltipContainer, css.tooltipWrapper) }
                data-placement={ placement }
                data-popper-reference-hidden={ isReferenceHidden }
            >
                { this.renderTooltip() }
                <div ref={ arrowProps.ref } style={ arrowProps.style } className={ uuiElement.tooltipArrow } />
            </div>
        );
    }

    private isTooltipExist() {
        return !!this.props.content || !!this.props.renderContent;
    }

    render() {
        return (
            <Manager>
                <Reference>
                    { ({ ref }) => <PopperTargetWrapper innerRef={ ref }>{ this.props.children }</PopperTargetWrapper> }
                </Reference>
                { this.isTooltipExist() && this.state.isOpen && <Portal target={ this.props.portalTarget }>
                    <Popper
                        placement={ this.props.placement || 'top' }
                        modifiers={ [
                            { name: 'preventOverflow', options: { boundary: this.props.boundaryElement } },
                            { name: 'offset', options: { offset: this.props.offset || [0, 12] } },
                            { name: 'computeStyles', options: { gpuAcceleration: false } },
                            { name: 'hide', enabled: true },
                        ] }
                    >
                        { this.renderTooltipBody }
                    </Popper>
                </Portal> }
            </Manager>
        );
    }
}