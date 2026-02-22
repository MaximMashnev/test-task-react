export interface BuildingEntity {
    id: number;
    name: string;
    address: string;
    dateRegistration: Date;
    numberApplications: number;
}

export type NewBuilding = Omit<BuildingEntity, "id">;