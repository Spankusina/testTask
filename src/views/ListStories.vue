<template>
    <div>
        <h1>Список статей</h1>
        <button class="refresh" @click="updateStorise" :disabled="isLoaded" title="Обновить статьи"></button>
        <div class="forTable">
            <p :style="{ display: !isLoadedFirstTime ? 'none' : 'block' }">Количество загруженных статей: {{
                countLoadedStories }} из 100</p>
            <img src="../assets/spiner.gif" :style="{ display: !isLoadedFirstTime ? 'none' : 'inline-block' }">
            <table :style="{ display: isLoadedFirstTime ? 'none' : 'table' }">
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Автор</th>
                        <th>Название</th>
                        <th>Рейтинг</th>
                        <th>Дата Публикации</th>
                    </tr>
                </thead>
                <tr v-for="(story, index) in stories" :key="story.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ story.by }}</td>
                    <td>
                        <router-link :to="{ name: 'story', params: { id: story.id } }" class="linkToStory">
                            {{ story.title }} {{ story.descendants }}
                        </router-link>
                    </td>
                    <td>{{ story.score }}</td>
                    <td>{{ story.time }}</td>
                </tr>
            </table>
        </div>
    </div>
</template>
  
<script>
import { getJson, timeConvert, loadedStories, urlAPI } from '../rest/rest.js'



function cacheStories(storiesData) {
    if (loadedStories.length === 0 || loadedStories[0].id != storiesData[0].id) {
        loadedStories.length = 0;
        loadedStories.push(...storiesData);
        console.log('Пришло новое');
    }
}

export default {
    name: 'ListStories',
    data() {
        return {
            stories: [],
            countLoadedStories: 0,
            isLoaded: false,
            isLoadedFirstTime: false
        }
    },
    methods: {
        async updateStorise() {
            this.isLoaded = true;
            this.stories = await this.getStoriesData();
            cacheStories(this.stories);
            this.isLoaded = false;
        },
        async getStoriesData() {
            this.countLoadedStories = 0;
            let StoriesId = await getJson(urlAPI);
            const storiesData = [];
            StoriesId = StoriesId.slice(0, 30);

            for (const story of StoriesId) {
                const urlStory = `https://hacker-news.firebaseio.com/v0/item/${story}.json`;
                let data = await getJson(urlStory);
                data.time = timeConvert(data.time);
                storiesData.push(data);
                this.countLoadedStories++;
                console.log("вот");
            }

            return storiesData;
        },
        async autoUpdate() {
            setInterval(async () => {
                await this.updateStorise();
            }, 60000);
        }
    },
    async mounted() {
        if (loadedStories.length === 0) {
            this.isLoadedFirstTime = true;
            await this.updateStorise();
            this.isLoadedFirstTime = false;
            this.autoUpdate();
        } else {
            this.stories.push(...loadedStories);
        }
    }
}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
    display: inline-block;
    font-size: 1.8em;
    margin: 0 20px 0 0;
}

.forTable {
    width: 100%;
    text-align: center;
}

.linkToStory {
    color: black;
    text-decoration: none;
}

.linkToStory:hover {
    color: rgb(70, 70, 247);
}

table {
    width: 98%;
    margin: auto;
    margin-top: 20px;
    border: 1px solid black;
    border-spacing: 0;
    text-align: left;
}

thead {
    background: rgb(190, 190, 190);
}

th,
td {
    border: 1px solid black;
    padding: 5px 0 5px 10px;
}
</style>
  