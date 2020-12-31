export const environment = {
  production: true,
  apiBase: 'https://deltaprop.herokuapp.com/',
  auth0: {
    url: 'project-bookmark.us', // the auth0 domain prefix
    audience: 'https://deltaprop.herokuapp.com/', // the audience set for the auth0 app
    clientId: 'oXVHGvc2nRVxnYvuee0CWvnHUdTuvvnM', // the client id generated for the auth0 app
    callbackURL: 'https://amolsb.github.io/deltaprop/list', // the base url of the running ionic application.
  }
};
