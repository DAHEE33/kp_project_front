import { createStore } from 'vuex'
import movie from './movie'
import about from './about'
import login from './login'
import sidetab from './sidetab'
export default createStore({
  modules: {
    movie,
    about,
    login,
    sidetab
  }
})
