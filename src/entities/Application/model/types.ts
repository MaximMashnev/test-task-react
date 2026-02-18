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