const backendPort = "5000";
const URL = `${location.protocol}//${location.hostname.replace('-4200', `-${backendPort}`)}${location.port ? `:${backendPort}` : ""}`;
// const URL = `https://library-server-nxlnbhoqaa-uc.a.run.app`;

export {
  URL
}