import { deleteQueue, handleTree, updateStatusBar, checkInput, updateForm } from './utils/functions.mjs';
import { Queue } from './utils/queue.mjs';

/*---------- DOM's ----------*/
const $form = document.getElementById('form');
const titleEl = document.getElementById('title');
const urlEl = document.getElementById('url');
const maxPagesEl = document.getElementById('max-pages');
const maxDepthEl = document.getElementById('max-depth');

/*---------- Functions ----------*/
const stream = async (request, queue) => {
    try {
        const response = await fetch('http://localhost:8000/stream', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ request }),
        });
        const responseObj = await response.json();

        if (!response.ok) throw { status: responseObj.status, message: responseObj.message };

        const tree = responseObj.data.tree;
        console.log(tree);

        if (tree.root) {
            updateStatusBar(tree);
            await handleTree(tree, queue);
        }

        if (!tree.isTreeComplete)
            setTimeout(() => {
                stream(request, queue);
            }, 2000);
    } catch (err) {
        console.log(err);
    }
};

/*---------- Event Listners ----------*/
$form.addEventListener('submit', async (event) => {
    event.preventDefault();
    deleteQueue();

    try {
        const title = titleEl.value;
        const url = urlEl.value;
        const maxPages = maxPagesEl.value;
        const maxLevel = maxDepthEl.value;

        const isInputValid = await checkInput(url, maxPages, maxLevel);
        if (isInputValid) {
            const request = { title, url, maxLevel, maxPages };
            const response = await fetch('http://localhost:8000/new-queue', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ request }),
            });
            const responseObj = await response.json();

            if (!(response.status === 200 || response.status === 201))
                throw { status: responseObj.status, message: responseObj.message };

            const queue = new Queue();
            const tree = responseObj.data?.tree;
            const $treeTitleEl = document.getElementById('tree-title');
            $treeTitleEl.innerText = title;

            if (tree?.root) {
                updateStatusBar(tree);
                await handleTree(tree, queue);
            }

            if (!tree?.isTreeComplete)
                setTimeout(() => {
                    stream(request, queue);
                }, 2000);
        }

        updateForm();
    } catch (err) {
        console.log(err);
    }
});
