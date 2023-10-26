import * as React from 'react';
import css from './LabeledInput.module.scss';
import { Icon, uuiElement, labelMod, LabeledInputCoreProps, cx } from '@epam/uui-core';
import { TooltipProps } from '../overlays/Tooltip';
import { FlexRow, FlexSpacer } from './flexItems';
import { Svg } from '../widgets/Svg';
import { i18n } from '../i18n';

export interface LabeledInputProps extends LabeledInputCoreProps {
    /** Overrides the default Tooltip component to use for info tooltip */
    Tooltip?: React.ComponentType<TooltipProps>;
    /** Overrides the default info icon */
    infoIcon?: Icon;
}

const uuiLabeledInput: Record<string, string> = {
    infoIcon: 'uui-labeled-input-info-icon',
    asterisk: 'uui-labeled-input-asterisk',
    optional: 'uui-labeled-input-optional',
    charCounter: 'uui-labeled-input-char-counter',
    footNote: 'uui-labeled-input-footnote',
    sideNote: 'uui-labeled-input-sidenote',
};

export class LabeledInput extends React.Component<LabeledInputProps> {
    getSideNote = (sideNote: React.ReactNode): React.ReactNode => {
        return (typeof sideNote === 'string')
            ? (
                <div className={ uuiLabeledInput.sideNote }>
                    {sideNote}
                </div>
            ) : sideNote;
    };

    getCharCounter = () => (
        <div className={ uuiLabeledInput.charCounter }>
            { `${this.props.value?.length || '0'}/${this.props.maxLength}` }
        </div>
    );

    render() {
        const Tooltip = this.props.Tooltip;
        const isCanBeOptional = !this.props.isRequired && this.props.labelPosition !== 'left' && this.props.isOptional;

        return (
            <div className={ cx(css.container, this.props.cx) } ref={ this.props.forwardedRef } { ...this.props.rawProps }>
                <div className={ cx(labelMod[this.props.labelPosition ? this.props.labelPosition : 'top']) }>
                    {this.props.label && (
                        <div className={ css.labelWrapper }>
                            <label htmlFor={ this.props.htmlFor } className={ uuiElement.label }>
                                {this.props.label}
                                {this.props.isRequired && <span className={ uuiLabeledInput.asterisk }>*</span>}
                                {this.props.info && Tooltip && (
                                    <Tooltip content={ this.props.info }>
                                        <Svg svg={ this.props.infoIcon } cx={ uuiLabeledInput.infoIcon } />
                                    </Tooltip>
                                )}
                                {isCanBeOptional && (
                                    <div className={ css.optionalFieldWrapper }>
                                        <div className={ uuiLabeledInput.optional }>{i18n.labeledInput.optionalFieldLabel}</div>
                                    </div>
                                )}
                            </label>
                            {this.props.sideNote && (
                                <>
                                    <FlexSpacer />
                                    {this.getSideNote(this.props.sideNote)}
                                </>
                            )}
                        </div>
                    )}
                    <div className={ this.props.labelPosition === 'left' ? css.rightChildrenPosition : undefined }>{this.props.children}</div>
                </div>
                {this.props.isInvalid && (
                    <FlexRow alignItems="top" columnGap={ 12 }>
                        <div role="alert" className={ uuiElement.invalidMessage }>
                            {this.props.validationMessage}
                        </div>
                        { this.props.charCounter && this.props.maxLength && this.getCharCounter()}
                    </FlexRow>
                )}
                {this.props.footNote && (
                    <FlexRow alignItems="top" columnGap={ 12 }>
                        <div className={ uuiLabeledInput.footNote }>
                            { this.props.footNote }
                        </div>
                        { this.props.charCounter && this.props.maxLength && !this.props.isInvalid && this.getCharCounter() }
                    </FlexRow>
                )}
                {!this.props.footNote && (this.props.charCounter && this.props.maxLength && !this.props.isInvalid) && this.getCharCounter()}
            </div>
        );
    }
}
