/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// create App
import { createApp } from 'vue'


// Components
import App from './App.vue'

// Plugins
import { registerPlugins } from './plugins'


// vuetify
import vuetify from './plugins/vuetify'

// Styles
import 'unfonts.css'

const app = createApp(App)

app.use(vuetify)

registerPlugins(app)

app.mount('#app')
