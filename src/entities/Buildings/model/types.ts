import { Dayjs } from "dayjs";

export interface BuildingEntity {
    id: number;
    name: string;
    address: string;
    dateRegistration: Dayjs;
    numberApplications: number;
}

export type NewBuilding = Omit<BuildingEntity, "id">;