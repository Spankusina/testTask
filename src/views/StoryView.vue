<template>
    <router-link :to="{ name: 'home' }" class="back"></router-link>
    <div class="story">
        <h1> {{ story.title }}</h1>
        <ul>
            <li><a :href="story.url" target="_blank">Ссылка</a></li>
            <li><p>Автор: {{ story.by }}</p></li>
            <li><p>Дата публикации: {{ story.time }}</p></li>
        </ul>
    </div>

    <div class="commentsConteyner">
        <div class="commentHeader">
            <h2>Комментарии {{ story.descendants }}</h2>
            <button class="refresh" title="Обновить комментарии" @click="refreshComments" :disabled="isLoadedComments"></button>
        </div>
        <div class="commentsBlock" v-for="comment of comments" :key="comment.id">
            <div class="commentKid" :data-id="comment.id">
                <div class="firstComment" 
                :class="{ hasKids: comment.click }"
                @click="onClickComment(comment.id)">
                    <div class="comment">
                        <div class="forName">
                            <h4>{{ comment.by }}</h4>
                            <img src="../assets/button-down.gif">
                            <h4>{{ comment.time }}</h4>
                        </div>
                        <p>{{ comment.text }}</p>
                    </div>
                </div>
            </div>
        </div>

        <img src="../assets/spiner.gif" :style="{ display: !isLoadedComments ? 'none' : 'inline-block' }">
    </div>
</template>

<script>
import { getJson, timeConvert, loadedStories } from '../rest/rest.js'

export default {
    name: 'StoryView',
    data() {
        return {
            story: 0,
            comments: [],
            isLoadedComments: false
        }
    },
    methods: {
        async getCommentsData(arrayComments) {
            this.isLoadedComments = true;
            let commentData = []
            for (const commentID of arrayComments) {
                let urlComment = `https://hacker-news.firebaseio.com/v0/item/${commentID}.json`
                let data = await getJson(urlComment);
                data.time = timeConvert(data.time);
                if (data.kids) {
                    data.click = true;
                } else {
                    data.click = false;
                }
                commentData.push(data);
                console.log('загружен комент')
            }

            this.isLoadedComments = false;
            return commentData
        },
        async onClickComment(commentId) {
            const clickedComment = this.comments.find(comment => comment.id === commentId)
            if (clickedComment.kids){
                clickedComment.click = false;
                await this.getNestedComments(clickedComment.kids, commentId)
            }
        },
        async getNestedComments(arrayKids, parentComment, level = 1) {
            for (const kid of arrayKids) {
                const urlComment = `https://hacker-news.firebaseio.com/v0/item/${kid}.json`
                let data = await getJson(urlComment);
                data.time = timeConvert(data.time);
                this.addNestedComment(data, parentComment, level);
                if (data.kids) {
                    await this.getNestedComments(data.kids, parentComment, level + 1)
                }
            }
        },
        addNestedComment(comment, parentComment, level) {
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
            
            const divCommentKid = document.querySelector(`div.commentKid[data-id="${parentComment}"]`);    
            divCommentKid.insertAdjacentHTML('beforeend', nestedCommentHTML);
        },
        async refreshComments() {
            this.comments.length = 0;
            this.comments = await this.getCommentsData(this.story.kids)
        }
    },
    async mounted() {
        const findStory = loadedStories.find(story => story.id == this.$route.params.id);
        if (findStory) {
            this.story = findStory;
            if (this.story.descendants > 0) {
                this.comments = await this.getCommentsData(this.story.kids)
            }
        } else {
            console.log("Объект не найден");
            this.$router.go(-1);
        }
    }
}
</script>

<style>
.back {
    display: block;
    width: 40px;
    height: 40px;
    background: url('../assets/back.png');
}
.story {
    text-align: left;
}

.commentsConteyner {
    width: 100%;
    margin: 50px 0 0 0;
}

.commentHeader {
    display: flex;
    justify-content: space-between;
}

.commentHeader>h2 {
    display: inline-block;
    margin: 0 20px 5px 20px;
}

.commentsBlock {
    margin: 20px 0 0 0;
    width: 100%;
}

.commentKid {
    width: 100%;
    text-align: left;
}

.firstComment {
    display: flex;
}

.firstComment img{
    display: none;
}

.hasKids {
    cursor: pointer;
}

.hasKids img{
    display: block;
    width: 24px;
    height: 24px;
    margin: 10px 0 0 0;
}

.comment {
    width: 100%;
    margin: 0 20px 20px 20px;
    padding-bottom: 10px;
}

.forName {
    display: flex;
    justify-content: space-between;
    border-top: 1px solid black;
    border-bottom: 1px solid black;
}

.forName>h4 {
    margin: 0;
    padding: 15px 0 15px 0;
}

.nestedComments {
    display: flex;
}

.dot {
    width: 12px;
    height: 12px;
    background: url('../assets/dot.png');
    background-size: contain;
    margin: 25px 0 0 20px;
}

.dot>h4 {
    padding: 0 10px 0 10px;
}</style>