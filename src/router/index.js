import { createRouter, createWebHistory } from 'vue-router'
import ListStories from '../views/ListStories.vue'
import StoryView from '../views/StoryView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: ListStories
  },
  {
    path: '/story/:id',
    name: 'story',
    component: StoryView,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
 