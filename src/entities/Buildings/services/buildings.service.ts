import { httpService } from "../../../shared/api/services/http.service"
import config from "../../../shared/configs/config.json"
import { BuildingEntity, NewBuilding } from "../model/types";

const BuildingEndpoind = config.api.endPoints.buildings;

const BuildingService = {
    async getBuildings () {
        const { data } = await httpService.get<BuildingEntity[]>(BuildingEndpoind);
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

    async delBuilding (building: BuildingEntity) {
        const { data } = await httpService.delete<BuildingEntity>(`${BuildingEndpoind}/${building.id}`);
        return data;
    }
}

export default BuildingService