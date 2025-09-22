import { Component, effect, input } from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeModule,
} from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlatTreeControl } from '@angular/cdk/tree';
import { NgClass } from '@angular/common';

interface TreeNode {
  key: string;
  value?: any;
  children?: TreeNode[];
}

interface FlatNode {
  expandable: boolean;
  key: string;
  level: number;
  value?: any;
}

/**
 * Displays a tree
 */
@Component({
  selector: 'app-attribute-tree',
  imports: [MatTreeModule, MatButtonModule, MatIconModule, NgClass],
  templateUrl: './attribute-tree.component.html',
  styleUrl: './attribute-tree.component.scss',
  standalone: true,
})
export class AttributeTreeComponent {
  private transformer = (node: TreeNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      key: node.key,
      level,
      value: node.value,
    };
  };

  treeControl = new FlatTreeControl<FlatNode>(
    (node) => node.level,
    (node) => node.expandable,
  );

  treeFlattener = new MatTreeFlattener<TreeNode, FlatNode>(
    this.transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  //
  // Signals
  //

  object = input({});

  /**
   * Constructor
   */
  constructor() {
    effect(() => {
      this.dataSource.data = this.objectToTree(this.object());
    });
  }

  //
  // Helpers
  //

  objectToTree(obj: Record<string, any>): TreeNode[] {
    return Object.entries(obj).map(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        return {
          key,
          children: this.objectToTree(value),
        };
      }
      return { key, value };
    });
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;
}
