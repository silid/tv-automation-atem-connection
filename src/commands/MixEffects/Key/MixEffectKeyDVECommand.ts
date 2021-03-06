import AbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { UpstreamKeyerDVESettings } from '../../../state/video/upstreamKeyers'
import { Util, Enums } from '../../..'

export class MixEffectKeyDVECommand extends AbstractCommand {
	static MaskFlags = {
		sizeX: 1 << 0,
		sizeY: 1 << 1,
		positionX: 1 << 2,
		positionY: 1 << 3,
		rotation: 1 << 4,
		borderEnabled: 1 << 5,
		shadowEnabled: 1 << 6,
		borderBevel: 1 << 7,
		borderOuterWidth: 1 << 8,
		borderInnerWidth: 1 << 9,
		borderOuterSoftness: 1 << 10,
		borderInnerSoftness: 1 << 11,
		borderBevelSoftness: 1 << 12,
		borderBevelPosition: 1 << 13,
		borderOpacity: 1 << 14,
		borderHue: 1 << 15,
		borderSaturation: 1 << 16,
		borderLuma: 1 << 17,
		lightSourceDirection: 1 << 18,
		lightSourceAltitude: 1 << 19,
		maskEnabled: 1 << 20,
		maskTop: 1 << 21,
		maskBottom: 1 << 22,
		maskLeft: 1 << 23,
		maskRight: 1 << 24,
		rate: 1 << 25
	}

	rawName = 'CKDV'
	mixEffect: number
	upstreamKeyerId: number
	properties: UpstreamKeyerDVESettings

	serialize () {
		const buffer = Buffer.alloc(64)
		buffer.writeUInt32BE(this.flag, 0)
		buffer.writeUInt8(this.mixEffect, 4)
		buffer.writeUInt8(this.upstreamKeyerId, 5)

		buffer.writeUInt32BE(this.properties.sizeX, 8)
		buffer.writeUInt32BE(this.properties.sizeY, 12)
		buffer.writeInt32BE(this.properties.positionX, 16)
		buffer.writeInt32BE(this.properties.positionY, 20)
		buffer.writeInt32BE(this.properties.rotation, 24)

		buffer[28] = this.properties.borderEnabled ? 1 : 0
		buffer[29] = this.properties.shadowEnabled ? 1 : 0
		buffer.writeUInt8(this.properties.borderBevel, 30)
		buffer.writeUInt16BE(this.properties.borderOuterWidth, 32)
		buffer.writeUInt16BE(this.properties.borderInnerWidth, 34)
		buffer.writeUInt8(this.properties.borderOuterSoftness, 36)
		buffer.writeUInt8(this.properties.borderInnerSoftness, 37)
		buffer.writeUInt8(this.properties.borderBevelSoftness, 38)
		buffer.writeUInt8(this.properties.borderBevelPosition, 39)
		buffer.writeUInt8(this.properties.borderOpacity, 40)

		buffer.writeUInt16BE(this.properties.borderHue, 42)
		buffer.writeUInt16BE(this.properties.borderSaturation, 44)
		buffer.writeUInt16BE(this.properties.borderLuma, 46)

		buffer.writeUInt16BE(this.properties.lightSourceDirection, 48)
		buffer.writeUInt8(this.properties.lightSourceAltitude, 50)

		buffer[51] = this.properties.maskEnabled ? 1 : 0
		buffer.writeUInt16BE(this.properties.maskTop, 52)
		buffer.writeUInt16BE(this.properties.maskBottom, 54)
		buffer.writeUInt16BE(this.properties.maskLeft, 56)
		buffer.writeUInt16BE(this.properties.maskRight, 58)

		buffer.writeUInt8(this.properties.rate, 60)

		return buffer
	}
}

export class MixEffectKeyDVEUpdateCommand extends AbstractCommand {
	rawName = 'KeDV'
	mixEffect: number
	upstreamKeyerId: number
	properties: UpstreamKeyerDVESettings

	deserialize (rawCommand: Buffer) {
		this.mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
		this.upstreamKeyerId = Util.parseNumberBetween(rawCommand[1], 0, 3)
		this.properties = {
			// Note: these are higher than the ui shows, but are within the range the atem can be set to
			sizeX: Util.parseNumberBetween(rawCommand.readUInt32BE(4), 0, Math.pow(2, 32) - 1),
			sizeY: Util.parseNumberBetween(rawCommand.readUInt32BE(8), 0, Math.pow(2, 32) - 1),

			positionX: Util.parseNumberBetween(rawCommand.readInt32BE(12), -1000 * 1000, 1000 * 1000),
			positionY: Util.parseNumberBetween(rawCommand.readInt32BE(16), -1000 * 1000, 1000 * 1000),
			rotation: Util.parseNumberBetween(rawCommand.readInt32BE(20), -332230, 332230),

			borderEnabled: rawCommand[24] === 1,
			shadowEnabled: rawCommand[25] === 1,
			borderBevel: Util.parseEnum<Enums.BorderBevel>(rawCommand.readUInt8(26), Enums.BorderBevel),
			borderOuterWidth: Util.parseNumberBetween(rawCommand.readUInt16BE(28), 0, 1600),
			borderInnerWidth: Util.parseNumberBetween(rawCommand.readUInt16BE(30), 0, 1600),
			borderOuterSoftness: Util.parseNumberBetween(rawCommand.readInt8(32), 0, 100),
			borderInnerSoftness: Util.parseNumberBetween(rawCommand.readInt8(33), 0, 100),
			borderBevelSoftness: Util.parseNumberBetween(rawCommand.readInt8(34), 0, 100),
			borderBevelPosition: Util.parseNumberBetween(rawCommand.readInt8(35), 0, 100),

			borderOpacity: Util.parseNumberBetween(rawCommand.readInt8(36), 0, 100),
			borderHue: Util.parseNumberBetween(rawCommand.readUInt16BE(38), 0, 3600),
			borderSaturation: Util.parseNumberBetween(rawCommand.readUInt16BE(40), 0, 1000),
			borderLuma: Util.parseNumberBetween(rawCommand.readUInt16BE(42), 0, 1000),

			lightSourceDirection: Util.parseNumberBetween(rawCommand.readUInt16BE(44), 0, 3599),
			lightSourceAltitude: Util.parseNumberBetween(rawCommand.readUInt8(46), 0, 100),

			maskEnabled: rawCommand[47] === 1,
			maskTop: Util.parseNumberBetween(rawCommand.readUInt16BE(48), 0, 38000),
			maskBottom: Util.parseNumberBetween(rawCommand.readUInt16BE(50), 0, 38000),
			maskLeft: Util.parseNumberBetween(rawCommand.readUInt16BE(52), 0, 52000),
			maskRight: Util.parseNumberBetween(rawCommand.readUInt16BE(54), 0, 52000),

			rate: Util.parseNumberBetween(rawCommand.readUInt8(56), 0, 250)
		}
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		const upstreamKeyer = mixEffect.getUpstreamKeyer(this.upstreamKeyerId)
		upstreamKeyer.dveSettings = {
			...this.properties
		}
		return `video.ME.${this.mixEffect}.upstreamKeyers.${this.upstreamKeyerId}.dveSettings`
	}
}
