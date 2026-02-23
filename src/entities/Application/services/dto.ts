import { Meta } from "../../../shared/api/services/types";
import { ApplicationEntity } from "../model/types";

export interface ApplicationsDTO {
    meta: Meta;
    items: ApplicationEntity[];
}