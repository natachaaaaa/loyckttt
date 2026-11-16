import './style.css'
import { createApp } from './app'

const root = document.getElementById('app')
// Built site: #app already holds the prerendered HTML, which Vue hydrates. Dev server: plain mount.
createApp(Boolean(root.firstElementChild), location.pathname).mount(root)
