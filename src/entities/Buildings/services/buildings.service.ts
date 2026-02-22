import { httpService } from "../../../shared/api/services/http.service"
import config from "../../../shared/configs/config.json"
import { BuildingEntity, NewBuilding } from "../model/types";
import { BuildingsDTO } from "./dto";
import { GridSortItem } from "@mui/x-data-grid/models/gridSortModel";
import { Pagination } from "../../../shared/api/services/types";

const BuildingEndpoind = config.api.endPoints.buildings;

const BuildingService = {
    async getBuildings (pagination: Pagination, sort: GridSortItem) {
        const sortDirection = () => {
            switch (sort.sort) {
                case "asc":
                    return "+";
                case "desc":
                    return "-";
                default:
                    return "";
            }
        }
        const sortField = sort? sort.field : "id";
        const sortDir = sort ? sortDirection() : "";
        const { data } = await httpService.get<BuildingsDTO>(
            `${BuildingEndpoind}`+
            `?page=${pagination.page}`+
            `&limit=${pagination.pageSize}`+
            `&sortBy=${sortDir}${sortField}`
            );
        return data;
    },

    async addBuilding (newBuilding: NewBuilding) {
        const { data } = await httpService.post<NewBuilding>(BuildingEndpoind, newBuilding);
        return data;
    },

    async editBuilding (building: BuildingEntity) {
        const { data } = await httpService.patch<BuildingEntity>(`${BuildingEndpoind}/${building.id}`, building);
        return data;
    },

    async deleteBuilding (building: BuildingEntity) {
        const { data } = await httpService.delete<BuildingEntity>(`${BuildingEndpoind}/${building.id}`);
        return data;
    }
}

export default BuildingService