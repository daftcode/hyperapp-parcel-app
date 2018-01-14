import { h, app } from 'hyperapp'
import debounce from 'debounce-promise'

const getUserDataFn = username => {
  return fetch(`https://api.github.com/users/${username}`)
    .then(res => res.json())
}

const getUserData = debounce(getUserDataFn, 700)

const state = {
  username: '',
  userData: null,
}

const actions = {
  updateUsername: (username) => (state, actions) => {
    getUserData(username).then(actions.setUserData)
    return { username }
  },
  setUserData: userData => state => ({ userData })
}

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

app(state, actions, view, document.body)
