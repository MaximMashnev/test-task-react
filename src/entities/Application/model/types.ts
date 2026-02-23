import { BuildingEntity } from "../../Buildings";

export enum ApplicationStatus {
    new = "new",
    inProgress = "in progress",
    completed = "completed",
    rejected = "rejected"
}

export interface ApplicationEntity {
    id: number;
    name: string;
    description: string;
    email: string;
    dateSubmission: Date;
    status: ApplicationStatus;
    building: BuildingEntity;
}

export type NewApplication = Omit<ApplicationEntity, "id">

export interface ApplicationCategory {
    id: number;
    name: string;
    score: number;
}

export interface LevelCriticality {
    level: string;
    score: number;
}