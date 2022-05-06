import * as vscode from 'vscode';
import { uiItems, flowItems, eduItems } from './constants';

export class SideBarItem extends vscode.TreeItem {
    constructor(
      public readonly label: string,
      public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
      super(label, collapsibleState);
    }
  }
  
export class SidebarItems implements vscode.TreeDataProvider<SideBarItem> {
  constructor(private items: any[]) {}

  getTreeItem(element: SideBarItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: SideBarItem): vscode.ProviderResult<SideBarItem[]> {
    if (element) {
      return null;
    } else {
      const sidebarItems: any[] = [];
      let sideBarItem: any = null;
      this.items.map((item: any) => {
          sideBarItem = new SideBarItem(
              item.label,
              vscode.TreeItemCollapsibleState.None
          );
          sideBarItem.command = {
              command: 'edu-tools.handleClickItem',
              title: item.label,
              arguments: [item.url, item.label, item.isOpenBrowser],
          };
          sidebarItems.push(sideBarItem);
      });

      return sidebarItems;
    }
  }
}

export const renderSideBar =  () => {
  // const uiSidebarItems = new SidebarItems(uiItems);
  // const flowSidebarItems = new SidebarItems(flowItems);
  const eduSidebarItems = new SidebarItems(eduItems);
  // vscode.window.registerTreeDataProvider('ui-tools', uiSidebarItems);
  // vscode.window.registerTreeDataProvider('workflow-tools', flowSidebarItems);
  vscode.window.registerTreeDataProvider('edu-tools', eduSidebarItems);
};
