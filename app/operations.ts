/// <reference path="../typings/index.d.ts" />

import * as _ from "lodash";

export enum OperationType {
	MilkRun = 1,
	EarlyBird,
	VenusFlytrap,
	FullMonty,
	Pencilneck,
	Charleston,
	TickerTape,
	TankTango,
	Hacksaw,
	UpperLip,
	PowderKeg,
	Mambo,
	SourGrapes,
	Bottleneck,
	Tinderbox,
	Foxtrot,
	Stronghold,
	ChokePoint,
	CurtainCall,
	DeadEnd,
	DeepCut,
	MassiveAttack
}

class Operation {
	constructor(public displayName: string, public aliases: string[]) {}

	public matches(aliasOrName: string): boolean {
		let lowerCaseName = aliasOrName.toLowerCase();

		return (this.displayName.toLowerCase() === lowerCaseName)
			|| (_.includes(this.aliases, lowerCaseName));
	}
}

export class Operations {
	private static operations: { [key: number]: Operation; } = {
		[OperationType.MilkRun]: new Operation("Milk Run", ["milk"]),
		[OperationType.EarlyBird]: new Operation("Early Bird", ["bird"]),
		[OperationType.VenusFlytrap]: new Operation("Venus Flytrap", ["venus"]),
		[OperationType.FullMonty]: new Operation("Full Monty", ["monty"]),
		[OperationType.Pencilneck]: new Operation("Pencilneck", ["pencil"]),
		[OperationType.Charleston]: new Operation("Charleston", ["charles"]),
		[OperationType.TickerTape]: new Operation("Ticker Tape", ["ticker"]),
		[OperationType.TankTango]: new Operation("Tank Tango", ["tango"]),
		[OperationType.Hacksaw]: new Operation("Hacksaw", ["hack"]),
		[OperationType.UpperLip]: new Operation("Upper Lip", ["upper"]),
		[OperationType.PowderKeg]: new Operation("Powder Keg", ["powder"]),
		[OperationType.Mambo]: new Operation("Mambo", ["mambo"]),
		[OperationType.SourGrapes]: new Operation("Sour Grapes", ["sour"]),
		[OperationType.Bottleneck]: new Operation("Bottleneck", ["bottle"]),
		[OperationType.Tinderbox]: new Operation("Tinderbox", ["tinder"]),
		[OperationType.Foxtrot]: new Operation("Foxtrot", ["fox"]),
		[OperationType.Stronghold]: new Operation("Stronghold", ["strong", "sh"]),
		[OperationType.ChokePoint]: new Operation("Choke Point", ["choke", "cp"]),
		[OperationType.CurtainCall]: new Operation("Curtain Call", ["cc"]),
		[OperationType.DeadEnd]: new Operation("Dead End", ["de"]),
		[OperationType.DeepCut]: new Operation("Deep Cut", ["dc"]),
		[OperationType.MassiveAttack]: new Operation("Massive Attack", ["ma"])
	}

	static isEnumIndex(key: string): boolean {
		const n = ~~Number(key);
		return String(n) === key && n >= 0;
	}

	static getOperation(aliasOrName: string) {
		for (var key in OperationType) {
			if (!this.isEnumIndex(key)) {
				continue;
			}

			if (aliasOrName.toLowerCase() === OperationType[key].toLowerCase()) {
				return key;
			}

			if (this.operations[key].matches(aliasOrName)) {
				return key;
			}
		}
	}
}