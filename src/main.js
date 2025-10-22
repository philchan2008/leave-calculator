/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import vuetify from './plugins/vuetify'

// Styles
import 'unfonts.css'

const app = createApp(App)

app.use(vuetify)

registerPlugins(app)

app.mount('#app')
