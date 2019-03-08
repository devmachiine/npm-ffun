(root, node_children) => {

    const leaves = (node) => {
        const descendants = node_children(node).flatMap(c => leaves(c))
        return descendants.length ? descendants : [node]
    }

    return leaves(root)
}
