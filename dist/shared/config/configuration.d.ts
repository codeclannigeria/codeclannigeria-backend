interface Database {
    host: string;
    port: number;
    name: string;
    uri: string;
}
interface Configuration {
    port: number;
    jwtSecret: string;
    database: Database;
    rootUrl: string;
    isAuthEnabled: boolean;
    appEmail: string;
}
declare const _default: () => Configuration;
export default _default;
