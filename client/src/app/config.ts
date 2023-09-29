const backendPort = "5000";
const URL = `${location.protocol}//${location.hostname.replace('-4200', `-${backendPort}`)}${location.port ? `:${backendPort}` : ""}`;

export {
  URL
}