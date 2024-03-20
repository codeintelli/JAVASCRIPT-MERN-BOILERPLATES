import consola from 'consola';
const Logger = {
    async success(message, obj = '') {
        if (obj) {
            consola.success(`${message} - ${obj}`);
        } else {
            consola.success(`${message}`);
        }
    },
    async error() {
        if (obj) {
            consola.error(`${message} - ${obj}`);
        } else {
            consola.error(`${message}`);
        }
    },
    async warning() {
        if (obj) {
            consola.warn(`${message} - ${obj}`);
        } else {
            consola.warn(`${message}`);
        }
    },
    async info() {
        if (obj) {
            consola.info(`${message} - ${obj}`);
        } else {
            consola.info(`${message}`);
        }
    },
};
export default Logger;
