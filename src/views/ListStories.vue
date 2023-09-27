<template>
    <div>
        <h1>Список статей</h1>
        <button class="refresh" @click="refreshStorise" :disabled="isLoadedStories" title="Обновить статьи"></button>
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
                            {{ story.title }}
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
import { saveCacheStories, loadCacheStories, getNewStoryIds, getJsonDetails } from '../api/api.js'

export default {
    name: 'ListStories',
    data() {
        return {
            stories: [],
            limitStories: 100,
            countLoadedStories: 0,
            isLoadedStories: false,
            isLoadedFirstTime: false
        }
    },
    methods: {
        async refreshStorise() {
            this.isLoadedStories = true;
            this.stories = await this.fetchNewStories();
            saveCacheStories(this.stories);
            this.isLoadedStories = false;
        },

        async fetchNewStories() {
            this.countLoadedStories = 0;
            const storiesData = [];
            const ids = await getNewStoryIds(0, this.limitStories);

            for (const id of ids) {
                storiesData.push(await getJsonDetails(id))
                this.countLoadedStories++;
            }

            return storiesData;
        },

        async autoUpdate() {
            setInterval(async () => {
                await this.refreshStorise();
            }, 60000);
        }
    },
    async mounted() {
        if (loadCacheStories().length === 0) {
            this.isLoadedFirstTime = true;
            await this.refreshStorise();
            this.isLoadedFirstTime = false;
            this.autoUpdate();
        } else {
            this.stories.length = 0;
            this.stories.push(...loadCacheStories());
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
  