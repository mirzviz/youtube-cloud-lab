import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'eu-north-1_tTLKhyaxW',
      userPoolClientId: '88ibejl43j430d43sj54eapea',
      signUpVerificationMethod: 'code',
      loginWith: {
        oauth: {
          domain: 'eu-north-1ttlkhyaxw.auth.eu-north-1.amazoncognito.com',
          scopes: ['email', 'openid', 'profile'],
          redirectSignIn: [
            'http://localhost:5173',
            'https://d3198bag3jewyq.cloudfront.net'
          ],
          redirectSignOut: [
            'http://localhost:5173',
            'https://d3198bag3jewyq.cloudfront.net'
          ],
          responseType: 'code'
        }
      }
    }
  }
});
