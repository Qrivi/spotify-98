import { render } from 'preact'
import Player from './components/player'
import './index.css'

render(<Player />, document.getElementById('app') as HTMLElement)
