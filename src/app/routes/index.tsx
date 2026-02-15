import { createBrowserRouter } from "react-router-dom";
import { PageWrapper } from "../layouts/PageWrapper";
import { lazy } from "react";

const MainPage = lazy(() => import("../../pages/main-page"));
const ApplicationPage = lazy(() => import("../../pages/application-page"));
const BuildingPage = lazy(() => import("../../pages/building-page"));
const DashboardPage = lazy(() => import("../../pages/dashboard-page"));
const NotFoundPage = lazy(() => import("../../pages/not-found-page"));
const ApplicationTrackingPage = lazy(() => import("../../pages/application-tracking-page"));
const LoginPage = lazy(() => import("../../pages/login-page"));

export const router = createBrowserRouter([
    {
        path: "/",
        element: <PageWrapper title="Главная страница" component={MainPage} />
    },
        {
        path: "applications",
        element: <PageWrapper title="Заявки" component={ApplicationPage} />
    },
        {
        path: "buildings",
        element: <PageWrapper title="Объекты" component={BuildingPage} />
    },
        {
        path: "dashboard",
        element: <PageWrapper title="Дашборд аналитики" component={DashboardPage} />
    },
    {
        path: "application-tracking/:id",
        element: <PageWrapper title="Отслеживание заявки" component={ApplicationTrackingPage} />
    },
    {
        path: "login",
        element: <PageWrapper title="Отслеживание заявки" component={LoginPage} />
    },
    {
        path: "*",
        element: <PageWrapper title="Страница не найдена" component={NotFoundPage} />
    }
])