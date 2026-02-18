import { FC, useEffect} from "react";
import { STORAGE_KEYS } from "../../../shared/consts";
import { useNavigate } from "react-router-dom";

interface RequireAuthProps {
    component: React.ComponentType;
}

export const RequireAuth: FC<RequireAuthProps> = ({component: Component}) => {

    const navigate = useNavigate();
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    useEffect(() => {
        if (!token) {
            navigate("login");
        }
    }, [token, navigate])

    if (!token) {
        return null;
    }

    return (<Component />);
}