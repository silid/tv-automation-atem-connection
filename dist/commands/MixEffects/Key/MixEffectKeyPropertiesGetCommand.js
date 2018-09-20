"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../../AbstractCommand");
const __1 = require("../../..");
class MixEffectKeyPropertiesGetCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'KeBP';
    }
    deserialize(rawCommand) {
        this.mixEffect = __1.Util.parseNumberBetween(rawCommand[0], 0, 3);
        this.properties = {
            upstreamKeyerId: __1.Util.parseNumberBetween(rawCommand[1], 0, 3),
            mixEffectKeyType: __1.Util.parseEnum(rawCommand[2], __1.Enums.MixEffectKeyType),
            flyEnabled: rawCommand[5] === 1,
            fillSource: rawCommand.readUInt16BE(6),
            cutSource: rawCommand.readUInt16BE(8),
            maskEnabled: rawCommand[10] === 1,
            maskTop: __1.Util.parseNumberBetween(rawCommand.readInt16BE(12), -9000, 9000),
            maskBottom: __1.Util.parseNumberBetween(rawCommand.readInt16BE(14), -9000, 9000),
            maskLeft: __1.Util.parseNumberBetween(rawCommand.readInt16BE(16), -16000, 16000),
            maskRight: __1.Util.parseNumberBetween(rawCommand.readInt16BE(18), -16000, 16000)
        };
    }
    applyToState(state) {
        const mixEffect = state.video.getMe(this.mixEffect);
        Object.assign(mixEffect.upstreamKeyers[this.properties.upstreamKeyerId], this.properties);
    }
}
exports.MixEffectKeyPropertiesGetCommand = MixEffectKeyPropertiesGetCommand;
//# sourceMappingURL=MixEffectKeyPropertiesGetCommand.js.map