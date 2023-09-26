<template>
    <router-link :to="{ name: 'home' }">back</router-link>
    <div class="story">
        <h1> {{ story.title }}</h1>
        <a :href="story.url" target="_blank">Ссылка</a>
        <p>Автор: {{ story.by }}</p>
        <p>Дата публикации: {{ story.time }}</p>
    </div>

    <div class="commentsConteyner">
        <div class="commentHeader">
            <h2>Комментарии {{ story.descendants }}</h2>
            <button class="refresh" title="Обновить комментарии"></button>
        </div>
        <div class="commentsBlock" v-for="comment of comments" :key="comment.id">
            <div class="commentKid">
                <div class="firstComment" @click="loadNestedComment(comment.id)">
                    <div class="comment">
                        <div class="forName">
                            <h4>{{ comment.by }}</h4>
                            <h4>{{ comment.time }}</h4>
                        </div>
                        <p>{{ comment.text }}</p>
                    </div>
                </div>
                <div class="nestedComment">
                    <div class="dot"></div>
                    <div class="comment">
                        <div class="forName">
                            <h4>Имя пользователя</h4>
                            <h4>время</h4>
                        </div>
                        <p>комментарии</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getJson, timeConvert, loadedStories } from '../rest/rest.js'

export default {
    name: 'StoryView',
    data() {
        return {
            story: 0,
            comments: []
        }
    },
    methods: {
        async getCommentsData(arrayComments) {
            let commentData = []
            for (const commentID of arrayComments) {
                let urlComment = `https://hacker-news.firebaseio.com/v0/item/${commentID}.json`
                let data = await getJson(urlComment);
                data.time = timeConvert(data.time);
                commentData.push(data);
                console.log('загружен комент')
            }

            return commentData
        },
        loadNestedComment(commentId) {
            console.log(commentId);
            // console.log(this.story.kids);
            // if (this.comments.kids) {
            //     console.log('ушел клик', commentId);
            // }
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

<style scoped>
.story {
    text-align: left;
}

.commentsConteyner {
    width: 100%;
    border: 1px solid black;
    background: red;
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
    background: rgb(0, 255, 89);
    text-align: left;
}

.firstComment {
    display: flex;
}

.comment {
    width: 100%;
    margin: 0 20px 20px 20px;
    padding-bottom: 10px;
    background: blue;
}

.forName {
    display: flex;
    justify-content: space-between;
    background: rgb(218, 252, 151);
}

.forName>h4 {
    margin: 0;
    /* padding: 0 10px 0 10px; */
}

.nestedComment {
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