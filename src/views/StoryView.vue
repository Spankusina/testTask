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
                        <p v-html="comment.text"></p>
                    </div>
                </div>
            </div>
        </div>

        <img src="../assets/spiner.gif" :style="{ display: !isLoadedComments ? 'none' : 'inline-block' }">
    </div>
</template>

<script>
import { loadCacheStories, getCommentsDetails, getJsonDetails, getNestedCommentsDetails } from '../api/api.js'

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
        async fetchNewComments(ids) {
            this.isLoadedComments = true;
            let commentData = []
            for (const id of ids) {
                commentData.push(await getCommentsDetails(id));
            }

            this.isLoadedComments = false;
            return commentData
        },

        async onClickComment(commentId) {
            const clickedComment = this.comments.find(comment => comment.id === commentId)
            if (clickedComment.kids){
                clickedComment.click = false;
                await getNestedCommentsDetails(clickedComment.kids, commentId)
            }
        },

        async refreshComments() {
            this.comments.length = 0;
            this.story = await getJsonDetails(this.story.id);
            if (this.story.descendants > 0){
                this.comments = await this.fetchNewComments(this.story.kids)
            }

        }
    },
    
    async mounted() {
        const findStory = loadCacheStories().find(story => story.id == this.$route.params.id);
        if (findStory) {
            this.story = findStory;
            if (this.story.descendants > 0) {
                this.comments = await this.fetchNewComments(this.story.kids)
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