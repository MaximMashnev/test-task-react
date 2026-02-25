import { httpService } from "../../../shared/api/services/http.service"
import config from "../../../shared/configs/config.json"
import dayjs from "dayjs";
import { ApplicationCategory, ApplicationEntity, NewApplication } from "../model/types";
import applicationsStore from "../model/store";
import { ApplicationsDTO, FileDTO } from "./dto";

const ApplicationsEndpoind = config.api.endPoints.applications;
const ApplicationsCategories = config.api.endPoints.category;
const ApplicationsUploads = config.api.endPoints.uploads;

const ApplicationService = {
    async getApplications () {
        const sortField = applicationsStore.sort ? applicationsStore.sort.field : "id";
        const sortDir = applicationsStore.sort ? applicationsStore.sort.sort === "desc" ? "-" : "" : "";
        const filter = () => {
            const filterItems = applicationsStore.filter?.items[0];
            if (filterItems?.field && filterItems?.value) {
                const filterOperator = filterItems.operator === 'is' ? "=" : filterItems.operator;
                const filterValue = () => {
                    switch(typeof filterItems.value) {
                        case "string":
                            return filterItems.value;
                        case "number":
                            return filterItems.value;
                        default:
                            return dayjs(filterItems.value).toISOString();
                    }
                }
                return `${filterItems.field}${filterOperator}${filterValue()}&`;
            }
            return "";
        }
        const { data } = await httpService.get<ApplicationsDTO>(
            `${ApplicationsEndpoind}?`+
            filter() +
            `page=${applicationsStore.pagination.page + 1}`+
            `&limit=${applicationsStore.pagination.pageSize}`+
            `&sortBy=${sortDir}${sortField}`
            );
        return data;
    },

    async getAllApplication () {
        const { data } = await httpService.get<ApplicationEntity[]>(`${ApplicationsEndpoind}`);
        return data;
    },

    async getApplication (id: number) {
        const { data } = await httpService.get<ApplicationEntity>(`${ApplicationsEndpoind}/${id}`);
        return data;
    },

    async getApplicationsCategories () {
        const { data } = await httpService.get<ApplicationCategory[]>(ApplicationsCategories);
        return data;
    },

    async addApplication (newApplication: NewApplication) {
        const { data } = await httpService.post<ApplicationEntity>(ApplicationsEndpoind, newApplication);
        return data;
    },

    async editApplication (editApplication: ApplicationEntity) {
        const { data } = await httpService.patch<ApplicationEntity>(`${ApplicationsEndpoind}/${editApplication.id}`, editApplication);
        return data;
    },

    async uploadFiles (file: File) {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await httpService.post<FileDTO>(`${ApplicationsUploads}`, formData);
        return data;
    },

    async getFiles (ids: number[]) {
        const linkIds = ids.reduce((link, num) => link + `id=${num}&`, "");
        const { data } = await httpService.get<FileDTO[]>(`${ApplicationsUploads}?${linkIds}`);
        return data;
    }
}

export default ApplicationService