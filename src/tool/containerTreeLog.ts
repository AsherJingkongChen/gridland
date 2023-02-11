import { Container } from "pixi.js";

const treelogHelper =
  (root: Container, maxDepth: number, depth = 0) => {
    if (depth === maxDepth) { return ''; }

    let result =
      ' '.repeat(depth * 2) +root.constructor.name + '\n';
    
    for (const child of root.children) {
      result +=
        treelogHelper(child as Container, maxDepth, depth + 1);
    }
    return result;
  };

export const containerTreeLog =
  (root: Container, maxDepth = 3) => {
    console.log(treelogHelper(root, maxDepth));
  };
