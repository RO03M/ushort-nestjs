export type TreeNode<T> = T & {
	children?: TreeNode<T>[];
	depth?: number;
};

export function list2Tree<T extends Record<string, unknown>>(
	flatList: T[],
	key: keyof T,
	parentKey: keyof T
) {
	const map: Record<string, TreeNode<T>> = {};
	const tree: TreeNode<T>[] = [];

	for (const item of flatList) {
		map[String(item[key])] = {
			...item
		};
	}

	for (const item of flatList) {
		const parent = map[String(item[parentKey])];
		const child = map[String(item[key])];

		if (parent) {
			if (!parent.children) {
				parent.children = [];
			}

			child.depth = parent.depth ?? 0 + 1;
			parent.children.push(child);
		} else {
			child.depth = 0;
			tree.push(child);
		}
	}

	return tree;
}

export function tree2List<T>(tree: TreeNode<T>) {
	const current: T & { children: undefined; depth: undefined } = {
		...tree,
		children: undefined,
		depth: undefined
	};

	delete current.children;
	delete current.depth;

	const list: T[] = [current];

	if (tree.children) {
		for (const child of tree.children) {
			list.push(...tree2List(child));
		}
	}

	return list;
}

export function findTreeNode<T, K extends keyof T>(
	nodes: TreeNode<T>[],
	key: K,
	value: T[K]
): TreeNode<T> | null {
	for (const node of nodes) {
		if (node[key] === value) {
			return node;
		}

		if (node.children === undefined) {
			continue;
		}

		const result = findTreeNode(node.children, key, value);

		if (result !== null) {
			return result;
		}
	}

	return null;
}

export function leavesFromTree<T>(tree: TreeNode<T>) {
	const leaves: T[] = [];
	if (tree.children === undefined || tree.children.length === 0) {
		leaves.push(tree);
	} else {
		for (const child of tree.children) {
			leaves.push(...leavesFromTree(child));
		}
	}

	return leaves;
}

export function getAncestorsFromNode<T, K extends keyof T>(
	nodes: TreeNode<T>[],
	key: K,
	value: T[K],
	carry: TreeNode<T>[] = []
): TreeNode<T>[] {
	for (const node of nodes) {
		if (node[key] === value) {
			return carry;
		}

		if (!Array.isArray(node.children)) {
			continue;
		}

		const { depth: _d, children: _c, ...clonedNode } = node;

		const ancestors = getAncestorsFromNode(node.children, key, value, [
			...carry,
			clonedNode as TreeNode<T>
		]);

		if (ancestors.length > 0) {
			return ancestors;
		}
	}

	return [];
}
