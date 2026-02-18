import config from "../../../shared/configs/config.json";
import { UserEntity } from "../../../entities/User";
import { httpService } from "../../../shared/api/services/http.service";

const authMe = config.api.endPoints.auth_me;
const auth = config.api.endPoints.auth;

interface loginData {
    data: Omit<UserEntity, "password">;
    token: string;
}

type LoginForm = Pick<UserEntity, "login" | "password">;
type AuthMe = Omit<UserEntity, "password">;

const authService = {
    async login (
        loginForm: LoginForm
    ) {
        const { data } = await httpService.post<loginData>(auth, loginForm);
        return data;
    },

    async authMe () {
        const { data } = await httpService.get<AuthMe>(authMe);
        return data;
    }
}

export default authService;