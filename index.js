import { h, app } from 'hyperapp'
import debounce from 'debounce-promise'

import './styles/main.sass'

const getUserDataFn = username => {
  return fetch(`https://api.github.com/users/${username}`)
    .then(res => res.json())
}

const getUserData = debounce(getUserDataFn, 700)

// single global state - one per app
const state = {
  username: '',
  userData: null,
}

const actions = {
  updateUsername: (username) => (state, actions) => {
    // perform side effect - fetching the user data from github API
    getUserData(username)
      .then(actions.setUserData)
    //  what the action actually changes in state is just username
    return { username }
  },
  // a simplest action, which just updates some part of state
  setUserData: userData => state => ({ userData })
}

// here comes the JSX, but remember that it's just syntactic sugar:
// <div className='classy'>hello</div>
// becomes
// h('div', {className: 'classy'}, 'hello')
// the 'h' corresponds to 'React.createElement' in React
const view = (state, actions) =>
  <main>
    <div>Search github users:</div>
    <input
      type='text'
      className='searchInput'
      value={state.username}
      oninput={e => actions.updateUsername(e.target.value)}
    />
    <br/>
    <div className='userCard'>
      {state.userData ? (
        <div>
          <img class='userCard__img' src={state.userData.avatar_url} />
          <div class='userCard__name'>{state.userData.name}</div>
          <div class='userCard__location'>{state.userData.location}</div>
        </div>
      ) : (
        <div>👆 search 'em</div>
      )}
    </div>
  </main>

// This runs the app. The return object (here not used) makes it possible
// to interact with the app from outside of the view
// In a real app, you should not attach the view directly to the body, but
// create some element in the static HTML to attach to.
// more on that: https://medium.com/@dan_abramov/two-weird-tricks-that-fix-react-7cf9bbdef375#486f
app(state, actions, view, document.body)
