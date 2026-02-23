import { makeAutoObservable, runInAction } from "mobx";
import { ApplicationCategory, ApplicationEntity, NewApplication} from "./types";
import { Meta} from "../../../shared/api/services/types";
import { GridSortItem } from "@mui/x-data-grid/models/gridSortModel";
import { GridFilterModel, GridPaginationModel } from "@mui/x-data-grid";
import ApplicationService from "../services/applications.service";

function createApplicationsStore() {
    return makeAutoObservable({
        applications: [] as ApplicationEntity[],
        pagination: {} as GridPaginationModel,
        meta: {} as Meta,
        sort: {} as GridSortItem,
        filter: {} as GridFilterModel | null,
        categories: [] as ApplicationCategory[],

        async getApplications() {
            try {
                const data = await ApplicationService.getApplications();
                runInAction(() => {
                    this.applications = data.items;
                    this.meta = data.meta;
                });
                console.log('Данные:', data);
            } 
            catch (error) {
                const getError = error instanceof Error ? error.message : "Ошибка загрузки";
                console.log(getError);
            }
        },

        async getApplicationsCategories() {
            try {
                const data = await ApplicationService.getApplicationsCategories();
                runInAction(() => {
                    this.categories = data;
                });
                console.log('Категории:', data);
            }
            catch (error) {
                const getError = error instanceof Error ? error.message : "Ошибка при получении категорий";
                console.log(getError);
            }
        },

        async addApplication(newApplication: NewApplication) {
            try {
                await ApplicationService.addApplication(newApplication);
                await this.getApplications();
            }
            catch (error) {
                const getError = error instanceof Error ? error.message : "Ошибка создания";
                console.log(getError);
            }
        },

        async editApplication(application: ApplicationEntity) {
            try {
                await ApplicationService.editApplication(application);
                await this.getApplications();
            }
            catch (error) {
                const getError = error instanceof Error ? error.message : "Ошибка редактирования";
                console.log(getError);
            }
        }
    },
    {},
    { autoBind: true }
    )
}

const applicationsStore = createApplicationsStore();
export default applicationsStore;