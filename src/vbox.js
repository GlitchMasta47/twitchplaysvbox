const soap = require('soap');
const logger = require('./logger')();

/**
 * @typedef {object} VirtualBoxErrorResponse
 * @property {string} faultcode
 * @property {string} faultstring
 * @property {object} detail
 */

/**
 * An error returned from the VirtualBox API
 */
class VirtualBoxError extends Error {
    /**
     * An error returned from the VirtualBox API
     * @param {string} message - The error message returned from the API
     * @param {VirtualBoxErrorResponse} data - The raw error object returned from the API
     */
    constructor(message, data) {
        super(message);
        this.name = 'VirtualBoxError';
        this.data = data;
    }
}

class VirtualBoxAPI {
    /**
     * Creates a new client for the VirtualBox API
     * @param {string} endpoint - The endpoint that VBoxWebSrv is listening on
     */
    constructor(endpoint = 'http://localhost:18083/') {
        this.endpoint = endpoint;
    }

    /**
     * Creates a new session and logs in
     * @param {string} username - The username to log in with
     * @param {string} password - The password to log in with
     */
    async login(username = '', password = '') {
        if (this.ivirtualbox) return;

        this.vbox = await soap.createClientAsync('./vbox-sdk/vboxwebService.wsdl', { endpoint: this.endpoint });

        let login_response = await this.makeRequest('IWebsessionManager_logon', { username, password });
        this.ivirtualbox = login_response.returnval;

        let session_response = await this.makeRequest('IWebsessionManager_getSessionObject', { 'refIVirtualBox': this.ivirtualbox });
        this.session = session_response.returnval;

        let version_response = await this.makeRequest('IVirtualBox_getVersion', { '_this': this.ivirtualbox });
        this.version = version_response.returnval;
    }

    async _lockMachine(name) {
        if (!name) throw new TypeError('"name" is required');

        let machine = await this.makeRequest('IVirtualBox_findMachine', {
            '_this': this.ivirtualbox,
            'nameOrId': name
        });

        await this.makeRequest('IMachine_lockMachine', {
            '_this': machine.returnval,
            'session': this.session,
            'lockType': 'Shared'
        });
    }

    async _unlockMachine() {
        await this.makeRequest('ISession_unlockMachine', { '_this': this.session });
    }

    /**
     * Sends a list of scancodes in order to a virtual machine
     * @param {string} name - The name of the virtual machine to put scancodes
     * @param {int[]} scancodes - The list of scancodes to put
     */
    async sendKeyboardEvent(name, scancodes) {
        if (!name) throw new Error('"name" is required');
        if (!scancodes) throw new Error('"scancodes" is required');

        await this._lockMachine(name);

        let console = await this.makeRequest('ISession_getConsole', { '_this': this.session });

        let keyboard = await this.makeRequest('IConsole_getKeyboard', { '_this': console.returnval });

        await this.makeRequest('IKeyboard_putScancodes', {
            '_this': keyboard.returnval,
            'scancodes': scancodes
        })

        await this._unlockMachine();
    }

    async makeRequest(name, args = {}) {
        if (!this.vbox[name + 'Async']) throw new TypeError(`"${name}" is an invalid request`)
        logger.debug({ args }, `Calling ${name}`);
        try {
            let response = await this.vbox[name + 'Async'](args)
            logger.debug({ parsed: response[0], raw_response: response[1], raw_request: response[3] }, `${name} responded successfully`);
            return response[0];
        } catch (err) {
            console.log(err)
            logger.debug({ response: err.root }, `${name} responded with error`);
            let real_err = err.root.Envelope.Body.Fault;
            throw new VirtualBoxError(real_err.faultstring, real_err);
        }
    }
}

module.exports = {
    VirtualBoxAPI,
    VirtualBoxError
}