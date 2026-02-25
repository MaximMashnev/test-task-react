import { makeAutoObservable, runInAction } from "mobx";
import { BuildingEntity, IncrementNumAppsBuilding, NewBuilding } from "./types";
import BuildingService from "../services/buildings.service";
import { Meta} from "../../../shared/api/services/types";
import { GridSortItem } from "@mui/x-data-grid/models/gridSortModel";
import { GridFilterModel, GridPaginationModel } from "@mui/x-data-grid";

function createBuildingsStore() {
    return makeAutoObservable({
        buildings: [] as BuildingEntity[],
        pagination: {} as GridPaginationModel,
        meta: {} as Meta,
        sort: {} as GridSortItem,
        filter: {} as GridFilterModel | null,

        async getBuildingsForTable() {
            try {
                const data = await BuildingService.getBuildings();
                runInAction(() => {
                    this.buildings = data.items;
                    this.meta = data.meta;
                });
            } 
            catch (error) {
                const getError = error instanceof Error ? error.message : "Ошибка загрузки";
                console.log(getError);
            }
        },

        async getAllBuildings() {
            try {
                const data = await BuildingService.getAllBuildings();
                runInAction(() => {
                    this.buildings = data;
                });
            } 
            catch (error) {
                const getError = error instanceof Error ? error.message : "Ошибка получения объектов";
                console.log(getError);
            }
        },

        async addBuilding(newObject: NewBuilding) {
            try {
                await BuildingService.addBuilding(newObject);
                await this.getBuildingsForTable();
            }
            catch (error) {
                const getError = error instanceof Error ? error.message : "Ошибка добавления";
                console.log(getError);
            }
        },

        async editBuilding(building: BuildingEntity) {
            try {
                await BuildingService.editBuilding(building);
                await this.getBuildingsForTable();
            }
            catch (error) {
                const getError = error instanceof Error ? error.message : "Ошибка редактирования";
                console.log(getError);
            }
        },

        async incrementNumApps (building: IncrementNumAppsBuilding) {
            try {
                await BuildingService.incrementNumApps(building);
            }
            catch (error) {
                const getError = error instanceof Error ? error.message : "Ошибка редактирования";
                console.log(getError);
            }
        },

        async deleteBuilding(building: BuildingEntity) {
            try {
                await BuildingService.deleteBuilding(building);
                await this.getBuildingsForTable();
            }
            catch (error) {
                const getError = error instanceof Error ? error.message : "Ошибка удаления";
                console.log(getError);
            }
        },
    },
    {},
    { autoBind: true }
    )
}

const buildingsStore = createBuildingsStore();
export default buildingsStore;