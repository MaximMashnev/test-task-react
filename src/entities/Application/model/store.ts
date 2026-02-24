import { makeAutoObservable, runInAction } from "mobx";
import { ApplicationCategory, ApplicationEntity, NewApplication } from "./types";
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
        files: [] as unknown as FileList,

        async getApplications() {
            try {
                const data = await ApplicationService.getApplications();
                runInAction(() => {
                    this.applications = data.items;
                    this.meta = data.meta;
                });
            } 
            catch (error) {
                const getError = error instanceof Error ? error.message : "Ошибка загрузки";
                console.log(getError);
            }
        },

        async getApplication(id: number) {
            try {
                const data = await ApplicationService.getApplication(id);
                return data;
            } 
            catch (error) {
                const getError = error instanceof Error ? error.message : "Ошибка загрузки";
                console.log(getError);
                return undefined;
            }
        },

        async getApplicationsCategories() {
            try {
                const data = await ApplicationService.getApplicationsCategories();
                runInAction(() => {
                    this.categories = data;
                });
            }
            catch (error) {
                const getError = error instanceof Error ? error.message : "Ошибка при получении категорий";
                console.log(getError);
            }
        },

        async addApplication(newApplication: NewApplication) {
            try {
                const data = await ApplicationService.addApplication(newApplication);
                return data;
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
        },

        async uploadFileApplication(file: File) {
            try {
                const data = await ApplicationService.uploadFiles(file);
                return data;
            }
            catch (error) {
                const getError = error instanceof Error ? error.message : "Ошибка при загрузке файлов";
                console.log(getError);
                return null;
            }
        },

        async getFilesApplication(ids: number[]) {
            try {
                const data = await ApplicationService.getFiles(ids);
                return data;
            }
            catch (error) {
                const getError = error instanceof Error ? error.message : "Ошибка при загрузке файлов";
                console.log(getError);
                return null;
            }
        },

        linkGeneration (a: ApplicationEntity) {
            const link: string = `${a.id}b${a.building_id}e${a.email.split('@')[0].slice(1, 3)}p`;
            return link;
        },

        linkDecrypting (l: string) {
            const id: number = Number(l.split('b')[0]);
            return id;
        }
    },
    {},
    { autoBind: true }
    )
}

const applicationsStore = createApplicationsStore();
export default applicationsStore;