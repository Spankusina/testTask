const apiUrl = 'https://hacker-news.firebaseio.com/v0/';
let loadedStories = []

const apiMethods = {
            getNewStories: 'getNewStories',
            getStoryDetails: 'getStoryDetails'
        }
    
    async function _getJson(url) {
        try {
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error('Произошла ошибка при загрузке данных')
            }
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Произошла ошибка при загрузке данных:', error)
        }
    }

    // eslint-disable-next-line no-unused-vars
    function _methodRoute(method, a1, a2, a3, a4) {
        switch (method) {
            case apiMethods.getNewStories:
                return `${apiUrl}newstories.json`
            case apiMethods.getStoryDetails:
                return `${apiUrl}item/${a1}.json`
            default:
                throw new Error(`Unsopported method ${method}`)
        }
    }

    function _convertTime(time) {
        const date = new Date(time * 1000)
        return date.toLocaleString("en-GB")
    }

    function _addNestedComment(comment, parentCommentId, level) {
        let dotHTML = '<div class="dot"></div>';
        dotHTML = dotHTML.repeat(level);
        const nestedCommentHTML =  `<div class="nestedComments">
                                        ${dotHTML}
                                        <div class="comment">
                                            <div class="forName">
                                                <h4>${comment.by}</h4>
                                                <h4>${comment.time}</h4>
                                            </div>
                                            <p>${comment.text}</p>
                                        </div>
                                    </div>`;
        
        const divCommentKid = document.querySelector(`div.commentKid[data-id="${parentCommentId}"]`);    
        divCommentKid.insertAdjacentHTML('beforeend', nestedCommentHTML);
    }

    async function getNewStoryIds(skip, limit) {
        const StoriesId = await _getJson(_methodRoute(apiMethods.getNewStories))
        return StoriesId.slice(skip, limit)
    }

    async function getJsonDetails(id) {
        let data = await _getJson(_methodRoute(apiMethods.getStoryDetails, id))
        
        if (data === null) {
            return;
        }

        data.time = _convertTime(data.time)
        return data
    }

    async function getCommentsDetails(id){
        let data = await getJsonDetails(id);
        if (data.kids) {
            data.click = true;
        } else {
            data.click = false;
        }

        return data;
    }

    async function getNestedCommentsDetails(ids, parentCommentId, level = 1) {
        for (const id of ids) {
            let data = await getJsonDetails(id);
            _addNestedComment(data, parentCommentId, level);
            if (data.kids) {
                await getNestedCommentsDetails(data.kids, parentCommentId, level + 1)
            }
        }
    }

    function saveCacheStories(storiesData) {
        if (loadedStories.length === 0 || loadedStories[0].id != storiesData[0].id) {
            loadedStories.length = 0;
            loadedStories.push(...storiesData);
        }
    }

    function loadCacheStories(){
        return loadedStories;
    }

export { saveCacheStories, loadCacheStories, getNewStoryIds, getJsonDetails, getCommentsDetails, getNestedCommentsDetails }