import { makeAutoObservable } from "mobx";
import { BuildingEntity, NewBuilding } from "./types";
import BuildingService from "../services/buildings.service";

function createBuildingsStore() {
    return makeAutoObservable({
        buildings: [] as BuildingEntity[],
        addBuilding(newObject: NewBuilding) {
            console.log("addBuilding");
        },

        async getBuildings() {
            try {
                const data = await BuildingService.getBuildings();
                this.buildings = data;
            } 
            catch (error) {
                console.log(error);
            } 
            finally {
                console.log("getBuildings");
            }
        },
    })
}

const buildingsStore = createBuildingsStore();
export default buildingsStore;