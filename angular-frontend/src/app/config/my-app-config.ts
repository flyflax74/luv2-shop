export default {   
    // okta config with openId
    oidc: {
        clientId: '0oa9e22wzwWQCfIfm5d7',
        issuer: 'https://dev-88593527.okta.com/oauth2/default',
        redirectUri: 'https://localhost/login/callback',
        scopes: ['openid', 'profile', 'email']                      // access to:
    }
}
