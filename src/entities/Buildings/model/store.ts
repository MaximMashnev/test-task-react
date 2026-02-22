import { makeAutoObservable, runInAction } from "mobx";
import { BuildingEntity, NewBuilding } from "./types";
import BuildingService from "../services/buildings.service";
import { Meta, Pagination } from "../../../shared/api/services/types";
import { GridSortItem } from "@mui/x-data-grid/models/gridSortModel";

function createBuildingsStore() {
    return makeAutoObservable({
        buildings: [] as BuildingEntity[],
        pagination: {} as Pagination,
        meta: {} as Meta,
        sort: {} as GridSortItem,

        // https://cd7336442031824d.mokky.dev/buildings?page=0&limit=0&sortBy=+id

        async getBuildings() {
            try {
                const data = await BuildingService.getBuildings(this.pagination, this.sort);
                runInAction(() => {
                    this.buildings = data.items;
                    this.meta = data.meta;
                });
                console.log('Данные:', data);
            } 
            catch (error) {
                const getError = error instanceof Error ? error.message : "Ошибка загрузки";
                console.log(getError);
            }
        },

        async addBuilding(newObject: NewBuilding) {
            try {
                await BuildingService.addBuilding(newObject);
                await this.getBuildings();
            }
            catch (error) {
                const getError = error instanceof Error ? error.message : "Ошибка добавления";
                console.log(getError);
            }
        },

        async editBuilding(building: BuildingEntity) {
            try {
                await BuildingService.editBuilding(building);
                await this.getBuildings();
            }
            catch (error) {
                const getError = error instanceof Error ? error.message : "Ошибка редактирования";
                console.log(getError);
            }
        },

        async deleteBuilding(building: BuildingEntity) {
            try {
                await BuildingService.deleteBuilding(building);
                runInAction(() => {
                    this.buildings = this.buildings.filter(item => item.id !== building.id);
                })
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