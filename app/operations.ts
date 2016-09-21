/// <reference path="../typings/index.d.ts" />

import * as _ from "lodash";

export enum OperationType {
	MilkRun = <any>"Milk Run",
	EarlyBird = <any>"Early Bird",
	VenusFlytrap = <any>"Venus Flytrap",
	FullMonty = <any>"Full Monty",
	Pencilneck = <any>"Pencilneck",
	Charleston = <any>"Charleston",
	TickerTape = <any>"Ticker Tape",
	TankTango = <any>"Tank Tango",
	Hacksaw = <any>"Hacksaw",
	UpperLip = <any>"Upper Lip",
	PowderKeg = <any>"Powder Keg",
	Mambo = <any>"Mambo",
	SourGrapes = <any>"Sour Grapes",
	Bottleneck = <any>"Bottleneck",
	Tinderbox = <any>"Tinderbox",
	Foxtrot = <any>"Foxtrot",
	Stronghold = <any>"Stronghold",
	ChokePoint = <any>"Choke Point",
	CurtainCall = <any>"Curtain Call",
	DeadEnd = <any>"Dead End",
	DeepCut = <any>"Deep Cut",
	MassiveAttack = <any>"Massive Attack"
}

export class Operations {
	private static aliases: { [key: number]: string[]; } = {
		[OperationType.MilkRun]: ["milk"],
		[OperationType.EarlyBird]: ["bird"],
		[OperationType.VenusFlytrap]: ["venus"],
		[OperationType.FullMonty]: ["monty"],
		[OperationType.Pencilneck]: ["pencil"],
		[OperationType.Charleston]: ["charles"],
		[OperationType.TickerTape]: ["ticker"],
		[OperationType.TankTango]: ["tango"],
		[OperationType.Hacksaw]: ["hack"],
		[OperationType.UpperLip]: ["upper"],
		[OperationType.PowderKeg]: ["powder"],
		[OperationType.Mambo]: ["mambo"],
		[OperationType.SourGrapes]: ["sour"],
		[OperationType.Bottleneck]: ["bottle"],
		[OperationType.Tinderbox]: ["tinder"],
		[OperationType.Foxtrot]: ["fox"],
		[OperationType.Stronghold]: ["strong", "sg"],
		[OperationType.ChokePoint]: ["choke", "cp"],
		[OperationType.CurtainCall]: ["cc"],
		[OperationType.DeadEnd]: ["de"],
		[OperationType.DeepCut]: ["dc"],
		[OperationType.MassiveAttack]: ["ma"],
	}

	static getOperation(aliasOrName: string) {
		for (var key in this.aliases) {
			if (_.includes(this.aliases[key], aliasOrName)) {
				return key;
			}
		}
	}
}