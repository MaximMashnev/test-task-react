import { httpService } from "../../../shared/api/services/http.service"
import config from "../../../shared/configs/config.json"
import { BuildingEntity, NewBuilding } from "../model/types";
import { BuildingsDTO } from "./dto";
import buildingsStore from "../model/store";
import dayjs from "dayjs";

const BuildingEndpoind = config.api.endPoints.buildings;

const BuildingService = {
    setDate(building: BuildingEntity | NewBuilding) {
        return {
            ...building,
            dateRegistration: dayjs(building.dateRegistration.setUTCHours(0, 0, 0, 0)).toISOString()
        }
    },

    async getBuildings () {
        const sortField = buildingsStore.sort ? buildingsStore.sort.field : "id";
        const sortDir = buildingsStore.sort ? buildingsStore.sort.sort === "desc" ? "-" : "" : "";
        const filter = () => {
            const filterItems = buildingsStore.filter?.items[0];
            if (filterItems?.field) {
                const filterOperator = filterItems.operator === 'is' ? "=" : filterItems.operator;
                const filterValue = typeof filterItems.value === "string" ? filterItems.value : dayjs(filterItems.value).toISOString()
                return `${filterItems.field}${filterOperator}${filterValue}&`;
            }
            return "";
        }
        const { data } = await httpService.get<BuildingsDTO>(
            `${BuildingEndpoind}?`+
            filter() +
            `page=${buildingsStore.pagination.page + 1}`+
            `&limit=${buildingsStore.pagination.pageSize}`+
            `&sortBy=${sortDir}${sortField}`
            );
        return data;
    },

    async addBuilding (newBuilding: NewBuilding) {
        const building = this.setDate(newBuilding);
        const { data } = await httpService.post<NewBuilding>(BuildingEndpoind, building);
        return data;
    },

    async editBuilding (editBuilding: BuildingEntity) {
        const building = this.setDate(editBuilding);
        const { data } = await httpService.patch<BuildingEntity>(`${BuildingEndpoind}/${editBuilding.id}`, building);
        return data;
    },

    async deleteBuilding (deleteBuilding: BuildingEntity) {
        const { data } = await httpService.delete<BuildingEntity>(`${BuildingEndpoind}/${deleteBuilding.id}`);
        return data;
    }
}

export default BuildingService