import { IPersistance } from './persistance.interface';

export interface ILayoutPersistance extends IPersistance {
	save(): IPersistance;
}
