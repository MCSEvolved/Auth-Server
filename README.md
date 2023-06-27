# Auth Server
The auth server is a server that handles all authentication and authorization that needs the firebase admin SDK. It also contains some non admin features to make sure this gets handled in one place by seperating the logic from the other services. 

## Checking user roles
After registration at firebase, frontend apps should send the idToken to the auth server to set the corresponding roles on the user.

|Method|Post|
|--|--|
|Endpoint|/auth/check-user-roles|
|Header-Param|authorization|

Add a header with:
- key: authorization
- value: [idtoken-here]

The response should be a status code 200.  
If a user's roles changed, the idtoken should be refreshed by the client. To tell the client this happened, the response will contain a response looking like this:
```json
{
  "shoudlRefreshToken": true
}
```
If the roles did not change, this will be false. 

The idtoken can typically be refreshed by calling:
```javascript
  getAuth().currentUser.getIdToken(/* force refresh: */ true)
```

## Exchange custom tokens
Services can create their own custom tokens at firebase to authenticate with the auth server. This way a service can retreive an idToken which can be validated by any service or client apps using the normal firebase sdk.

|Method|POST|
|--|--| 
|Endpoint|/auth/exchange-custom-token|
|Header-Param|custom-token|

Add a header with:
- key: custom-token
- value: [custom-token-here]

The response should be a status code 200 looking like this:
```json
{
  "idToken": "abcMyIDToken",
  "refreshToken":"myUselessRefreshToken"
}
```
For now the refreshtoken does not have a use.

The response can also be a status code 400 with a clear error message.
Please report any status code 500 errors.

## Get a user's claims
It's possible to retreive a user's claims through the auth server. I'm not sure this is the best way as any client should be able to handle verification of idtokens themselves with the normal firebase SDK.  
#### This works for any idtoken, not just users.

|Method|Get|
|--|--| 
|Endpoint|/auth/get-user-claims|
|Header-Param|authorization|

Add a header with: 
- key: authorization
- value: [idtoken-here]

The response should be a status code 200 looking like this:
```json
{
  "email": "my_email@mcs.nl",
  "role": "isService",
  "etc"
}
```

The response can also be a status code 400 with a clear error message.
Please report any status code 500 errors.

## Generate ID Token for minecraft server
Currently this is not implemented.
