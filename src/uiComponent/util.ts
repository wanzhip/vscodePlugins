import { workspace, TextDocument, Position, Range } from 'vscode';

const PRE_TAG_REG = /<([\w-]+)(\s[:@-\w]*(=['"][:@-\w]*['"])?)*\s*(\s:)?/;
const END_TAG_REG = /(\/>)|(<\/[\w-]+>)(\s)*$/;
const PRE_ATTR_REG = /\s([\w\.@:-]+)(=['"][\w\.@:-]*['"])?/g;
  
  /**
   * 获取当前行在当前位置之前的文本
   * @param position 当前光标位置
   */
  export function getTextBeforePosition(document:TextDocument, position: Position): string {
    const start = new Position(position.line, 0);
    const range = new Range(start, position);
    return document.getText(range)
  }

  export function notInTemplate(document: TextDocument, position: Position): boolean {
    let line = position.line;
    while(line) {
      if (/^\s*<template.*>\s*$/.test(<string>document.lineAt(line).text)) {
        return false;
      }
      if (/^\s*<script.*>\s*$/.test(<string>document.lineAt(line).text)) {
        return true;
      }
      if (/^\s*<style.*>\s*$/.test(<string>document.lineAt(line).text)) {
        return true;
      }
      if (/^\s*<\/template>.*$/.test(<string>document.lineAt(line).text)) {
        return true;
      }
      line--;
    }
    return false;
  }

  export function notInScript(document: TextDocument, position: Position): boolean {
    let line = position.line;
    while(line) {
      if (/^\s*<script.*>\s*$/.test(<string>document.lineAt(line).text)) {
        return false;
      }
      if (/^\s*<template.*>\s*$/.test(<string>document.lineAt(line).text)) {
        return true;
      }
      if (/^\s*<style.*>\s*$/.test(<string>document.lineAt(line).text)) {
        return true;
      }
      if (/^\s*<\/script>.*$/.test(<string>document.lineAt(line).text)) {
        return true;
      }
      line--;
    }
    return false;
  }

  export function getPreTag(document: TextDocument, position: Position) {
    let line = position.line;
    let curLine = position.line;
    let txt = getTextBeforePosition(document, position);
    let tagMatch = PRE_TAG_REG.exec(txt);

    if (END_TAG_REG.test(txt)) {
      return null;
    }

    if (tagMatch === null) {
      while(line - curLine < 10 && curLine >= 0 && tagMatch === null) {
        curLine--;
        txt = document.lineAt(curLine).text;
        tagMatch = PRE_TAG_REG.exec(txt);
        if (END_TAG_REG.test(txt)) {
          return null;
        }
      }
    }

    if (tagMatch !== null) {
      return tagMatch[1];
    }

    return null;
  }

  // 找到这个标签所有属性，包括prop和event
  export function findAllSubAttrFromLine(parent: string) {
    const result: any = {}
    let match = PRE_ATTR_REG.exec(parent)
    while(match !== null) {
      const attrStr = match[1].split('=')[0] || '';
      result[attrStr] = true;
      match = PRE_ATTR_REG.exec(parent);
    }
    return result;
  }

  export function getPreTagAndAttrAndEvent(document: TextDocument, position: Position) {
    let line = position.line;
    let curLine = position.line;
    let txt = getTextBeforePosition(document, position);
    let tagMatch = PRE_TAG_REG.exec(txt);

    if (END_TAG_REG.test(txt)) {
      return null;
    }

    let attrMap = {
      ...findAllSubAttrFromLine(txt)
    }
    const result = {
      tag: '',
      attrs: attrMap
    }

    if (tagMatch === null) {
      while(line - curLine < 10 && curLine >= 0 && tagMatch === null) {
        curLine--;
        txt = document.lineAt(curLine).text;

        if (END_TAG_REG.test(txt)) {
          return null;
        }

        tagMatch = PRE_TAG_REG.exec(txt);
        attrMap = {
          ...attrMap,
          ...findAllSubAttrFromLine(txt)
        }
      }
    } else {
      result.tag = tagMatch[1];
    }

    return result;
  }

  export function getConfig(key: string): any {
    const config = workspace.getConfiguration('element-vue-helper');
    return config.get(key);
  }
