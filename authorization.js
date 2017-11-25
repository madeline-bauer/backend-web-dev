module.exports = {
	authorized: function(req){
			
		import auth0 from 'auth0-js'
		import EventEmitter from 'EventEmitter'
		import router from './../router'
		
		export default class AuthService {
		
		  authenticated = this.isAuthenticated()
		  authNotifier = new EventEmitter()
		
		  constructor () {
			this.login = this.login.bind(this)
			this.setSession = this.setSession.bind(this)
			this.logout = this.logout.bind(this)
			this.isAuthenticated = this.isAuthenticated.bind(this)
		  }
		
		  auth0 = new auth0.WebAuth({
			domain: 'furman.auth0.com',
			clientID: 'SNJFYUel7IkquERyf9GLJwdc7YlUy9ds',
			redirectUri: 'http://localhost:8080/callback',	//TODO CHANGE LOCAL HOST NUMBER TO CORRECT. ONCE DOMAIN IS PURCHASED. CHANGE TO DOMAIN NAME
			audience: 'https://furman.auth0.com/userinfo',
			responseType: 'token id_token',
			scope: 'openid'
		  })
		
		  login () {
			this.auth0.authorize()
		  }
		  handleAuthentication () {
			this.auth0.parseHash((err, authResult) => {
			  if (authResult && authResult.accessToken && authResult.idToken) {
				this.setSession(authResult)
				router.replace('home')
			  } else if (err) {
				router.replace('home')
				console.log(err)
			  }
			})
		  }
		
		  setSession (authResult) {
			// Set the time that the access token will expire at
			let expiresAt = JSON.stringify(
			  authResult.expiresIn * 1000 + new Date().getTime()
			)
			localStorage.setItem('access_token', authResult.accessToken)
			localStorage.setItem('id_token', authResult.idToken)
			localStorage.setItem('expires_at', expiresAt)
			this.authNotifier.emit('authChange', { authenticated: true })
		  }
		
		  logout () {
			// Clear access token and ID token from local storage
			localStorage.removeItem('access_token')
			localStorage.removeItem('id_token')
			localStorage.removeItem('expires_at')
			this.userProfile = null
			this.authNotifier.emit('authChange', false)
			// navigate to the home route
			router.replace('home')
		  }
		
		  isAuthenticated () {
			// Check whether the current time is past the
			// access token's expiry time
			let expiresAt = JSON.parse(localStorage.getItem('expires_at'))
			return new Date().getTime() < expiresAt
		  }
		}

		//var authorized = true; // DELETEME // DEBUG
		//return authorized;
	}
}