"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Step = void 0;
class Step {
    constructor(_name, _version) {
        this._name = _name;
        this._version = _version;
    }
    getName() { return this._name; }
    ;
    getVersion() { return this._version; }
    ;
    setName(name) { this._name = name; }
    setVersion(version) { this._version = version; }
}
exports.Step = Step;
//# sourceMappingURL=types.js.map