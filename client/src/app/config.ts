const backendPort = "5000";
const URL = `${location.protocol}//${location.hostname.replace('-4200', `-${backendPort}`)}${location.port ? `:${backendPort}` : ""}`;
// const URL = `https://library-management-system-930413307030.us-central1.run.app/`;

export {
  URL
}
