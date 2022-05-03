import {
  CompletionItemProvider, ProviderResult,
  TextDocument, Position, CompletionItem, CompletionList, CompletionItemKind,
  SnippetString
} from 'vscode';

import config from '../config/index';
import { getTextBeforePosition, notInTemplate, getPreTag } from '../util';

export default class AttrValueCompletionProvider implements CompletionItemProvider {
  IS_ATTR_VALUE = /((v-bind:)|:)?([\w-]+)=['"][^'"]*$/;

  buildAttrValueSuggestion(attrOptionDesc: any) {
    const insertText = `\$\{0:${attrOptionDesc.value}\}`;

    return {
      label: attrOptionDesc.value,
      sortText: `0${attrOptionDesc.sort || ''}${attrOptionDesc.value}`,
      insertText: new SnippetString(insertText),
      kind: CompletionItemKind.Value,
      detail: `[VUE] ${attrOptionDesc.detail || attrOptionDesc.value}`,
      documentation: attrOptionDesc.documentation || insertText
    }
  }

  provideCompletionItems(document: TextDocument, position: Position): ProviderResult<CompletionItem[] | CompletionList> {
    const txt = getTextBeforePosition(document, position);
    const tag = getPreTag(document, position);

    const match = this.IS_ATTR_VALUE.exec(txt) || [];
    const attrName = match[3];

    if (tag && attrName && !notInTemplate(document, position)) {
      const tagInfo: any = config.filter((item: any) => item.name === tag)[0] || {props: []};
      const attrs: any = tagInfo.props.filter((item: any) => item.key === attrName)[0] || {options: []};
      const options = attrs.options || [];
      return options.map((option: any) => this.buildAttrValueSuggestion(option));
    }
    return [];
  }
}