const URL = window.location.href;

const parseNode = (node) => {
    const $nodeEl = document.getElementById(node.id);

    while ($nodeEl.firstElementChild) $nodeEl.removeChild($nodeEl.lastElementChild);

    const div = document.createElement('div');
    div.innerText = node.title ? node.title.trim() : node.url;

    const childrenListEl = document.createElement('ul');
    for (let child of node.children) {
        const childEl = document.createElement('li');
        childEl.id = child.id;
        childrenListEl.appendChild(childEl);
    }
    childrenListEl.style.display = 'none';

    div.addEventListener('click', (event) => {
        event.stopPropagation();

        const children = event.target.parentElement.lastElementChild;
        children.style.display = children.style.display === '' ? 'none' : '';
    });

    $nodeEl.append(div, childrenListEl);
};

const getNodeByID = (id, tree) => {
    let node = tree.root;
    if (node === null) return;
    if (node.children.length === 0) return node;

    const idArr = id.split('/');

    for (let i = 1; i < idArr.length; i++) {
        let workerID = parseInt(idArr[i]);
        node = node.children[workerID];
    }
    return node;
};

const deleteQueue = () => {
    const root = document.getElementById('0');

    if (root.firstElementChild) {
        root.value = '';
        while (root.firstElementChild) root.removeChild(root.lastElementChild);
    }
};

const handleTree = async (tree, queue) => {
    const maxPages = tree.maxPages;
    let numNodesParsed = document.getElementsByTagName('ul').length - 3;
    queue.enqueue(tree.root.title, 1, '0');

    while (queue.size > 0) {
        //&& numNodesParsed < maxPages
        const node = getNodeByID(queue.dequeue().id, tree);
        if (node) {
            const children = node.children;
            children.forEach((child) => {
                if (child.title === '') queue.enqueue(child.url, child.depthLevel, child.id);
                else queue.enqueue(child.title, child.depthLevel, child.id);
            });

            const nodeEl = document.getElementById(node.id);
            if (nodeEl) {
                parseNode(node);
                numNodesParsed++;
            }
        }
    }
};

const updateStatusBar = (tree) => {
    const $treeContainerEl = document.getElementById('tree-container');
    const $pagesAmountEl = document.getElementById('pages-amount');
    const $levelsAmountEl = document.getElementById('levels-amount');

    $treeContainerEl.style.display = '';
    $pagesAmountEl.innerText = tree.numOfNodes >= parseInt(tree.maxPages) ? tree.maxPages : tree.numOfNodes;
    $levelsAmountEl.innerText = tree.countLevels >= parseInt(tree.maxLevel) ? tree.maxLevel : tree.countLevels;
};

const checkURL = async (userInput) => {
    try {
        const response = await fetch(`${URL}check-url`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: userInput }),
        });

        if (!response.ok) throw response;

        return response;
    } catch (err) {
        console.log(err);
        alert('Invalid URL. Please type a valid URL.');
    }
};

const checkInput = async (url, maxPages, maxLevel) => {
    const isURLValid = await checkURL(url);
    if (maxPages < 0 || maxLevel < 0 || !isURLValid) return false;

    return true;
};

const updateForm = () => {
    const titleEl = document.getElementById('title');
    const urlEl = document.getElementById('url');
    const maxPagesEl = document.getElementById('max-pages');
    const maxDepthEl = document.getElementById('max-depth');

    titleEl.value = '';
    urlEl.value = 'Enter the link here...';
    maxPagesEl.value = '';
    maxDepthEl.value = '';
};

export { deleteQueue, handleTree, updateStatusBar, checkInput, updateForm };
