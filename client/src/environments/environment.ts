// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiHost: 'http://192.168.60.241:8080/', // use your local IP address to establish communication between the wallet and the server
  apiPrefix: 'api/v1/',
  webSocketHost: 'http://192.168.60.241:8080' // use your local IP address to establish communication between the wallet and the server
};
