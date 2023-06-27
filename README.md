# Auth Server
The auth server is a server that handles all authentication and authorization that needs the firebase admin SDK. It also contains some non admin features to make sure this gets handled in one place by seperating the logic from the other services. 

## Checking user roles
After registration at firebase, frontend apps should send the idToken to the auth server to set the corresponding roles on the user.

## Exchange custom tokens
Services can create their own custom tokens at firebase to authenticate with the auth server. This way a service can retreive an idToken which can be validated by any service or client apps using the normal firebase sdk.

|Endpoint|/auth/exchange-custom-token|
|--|--| 
|Header-Param|custom-token|

Just add a header with:
- key: custom-token
- value: [idtoken-here]

The response should be a status code 200 looking like this:
```json
{
  "idToken": "abcMyIDToken"
  "refreshToken": "myUselessRefreshToken"
}
```
For now the refreshtoken does not have a use.

The response can also be a status code 400 with a clear error message.
Please report any status code 500 errors.

## Get a users claims.
