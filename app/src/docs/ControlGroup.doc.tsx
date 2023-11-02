import * as React from 'react';
import {
    BaseDocsBlock, DocExample, EditableDocContent, TSkin,
} from '../common';
import { DocBuilder } from '@epam/uui-docs';
import * as uuiComponents from '@epam/uui-components';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as promoDocs from './_props/epam-promo/docs';
import * as loveshipDocs from './_props/loveship/docs';
import { TDocConfig } from '../common/docs/docBuilderGen/types';

export class ControlGroupDoc extends BaseDocsBlock {
    title = 'Control Group';

    override config: TDocConfig = {
        name: 'ControlGroup',
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui-components:ControlGroupProps', component: uui.ControlGroup },
            [TSkin.UUI3_loveship]: {
                type: '@epam/uui-components:ControlGroupProps',
                component: loveship.ControlGroup,
                doc: (doc: DocBuilder<uuiComponents.ControlGroupProps>) => doc.withContexts(loveshipDocs.FormContext, loveshipDocs.ResizableContext),
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/uui-components:ControlGroupProps',
                component: promo.ControlGroup,
                doc: (doc: DocBuilder<uuiComponents.ControlGroupProps>) => doc.withContexts(promoDocs.FormContext, promoDocs.ResizableContext),
            },
        },
        doc: (doc: DocBuilder<uuiComponents.ControlGroupProps>) => {
            doc.merge('children', {
                examples: [
                    {
                        name: '<Button/>, <Button/>, <Button/>',
                        value: (
                            <React.Fragment>
                                <uui.Button color="accent" mode="solid" caption="Submit" onClick={ () => {} } />
                                <uui.Button caption="Help" onClick={ () => {} } />
                                <uui.Button color="primary" mode="ghost" caption="Cancel" onClick={ () => {} } />
                            </React.Fragment>
                        ),
                        isDefault: true,
                    }, {
                        name: '<TextInput/>, <TextInput/>, <TextInput/>',
                        value: (
                            <React.Fragment>
                                <uui.TextInput value="Alex" onValueChange={ null } />
                                <uui.TextInput value="Minsk" onValueChange={ null } />
                                <uui.TextInput value="Belarus" onValueChange={ null } />
                            </React.Fragment>
                        ),
                    },
                ],
            });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="controlGroup-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/controlGroup/Basic.example.tsx" />
                <DocExample title="Prefix" path="./_examples/controlGroup/Prefix.example.tsx" />
            </>
        );
    }
}
