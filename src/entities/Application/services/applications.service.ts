import { httpService } from "../../../shared/api/services/http.service"
import config from "../../../shared/configs/config.json"
import dayjs from "dayjs";
import { ApplicationCategory, ApplicationEntity, NewApplication } from "../model/types";
import applicationsStore from "../model/store";
import { ApplicationsDTO } from "./dto";

const ApplicationsEndpoind = config.api.endPoints.applications;
const ApplicationsCategories = config.api.endPoints.category;

const ApplicationService = {
    async getApplications () {
        const sortField = applicationsStore.sort ? applicationsStore.sort.field : "id";
        const sortDir = applicationsStore.sort ? applicationsStore.sort.sort === "desc" ? "-" : "" : "";
        const filter = () => {
            const filterItems = applicationsStore.filter?.items[0];
            if (filterItems?.field) {
                const filterOperator = filterItems.operator === 'is' ? "=" : filterItems.operator;
                const filterValue = typeof filterItems.value === "string" ? filterItems.value : dayjs(filterItems.value).toISOString()
                return `${filterItems.field}${filterOperator}${filterValue}&`;
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

    async getApplicationsCategories () {
        const { data } = await httpService.get<ApplicationCategory[]>(ApplicationsCategories);
        return data;
    },

    async addApplication (newApplication: NewApplication) {
        const { data } = await httpService.post<NewApplication>(ApplicationsEndpoind, newApplication);
        return data;
    },

    async editApplication (editApplication: ApplicationEntity) {
        const { data } = await httpService.patch<ApplicationEntity>(`${ApplicationsEndpoind}/${editApplication.id}`, editApplication);
        return data;
    }
}

export default ApplicationService