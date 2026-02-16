import { createBrowserRouter } from "react-router-dom";
import { PageWrapper } from "../layouts/PageWrapper";
import { lazy } from "react";

const MainLayout = lazy(() => import("../layouts/MainLayout"));
const ToolpadLayout = lazy(() => import("../layouts/ToolpadLayout"));
const MainPage = lazy(() => import("../../pages/main-page"));
const ApplicationCreatingPage = lazy(() => import("../../pages/application-creating-page"))
const ApplicationPage = lazy(() => import("../../pages/applications-page"));
const BuildingPage = lazy(() => import("../../pages/buildings-page"));
const DashboardPage = lazy(() => import("../../pages/dashboard-page"));
const NotFoundPage = lazy(() => import("../../pages/not-found-page"));
const ApplicationTrackingPage = lazy(() => import("../../pages/application-tracking-page"));
const LoginPage = lazy(() => import("../../pages/login-page"));

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: "/",
                element: <PageWrapper title="Главная страница" component={MainPage} />
            },
            {
                path: "new-application",
                element: <PageWrapper title="Создание заявки" component={ApplicationCreatingPage} />
            },
            {
                path: "application-tracking/:id",
                element: <PageWrapper title="Отслеживание заявки" component={ApplicationTrackingPage} />
            }
        ]
    },
    {
        path: "tp",
        element: <ToolpadLayout />,
        children: [
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
                element: <PageWrapper title="Аналитика" component={DashboardPage} />
            },
        ]
    },
    {
        path: "login",
        element: <PageWrapper title="Авторизация" component={LoginPage} />
    },
    {
        path: "*",
        element: <PageWrapper title="Страница не найдена" component={NotFoundPage} />
    }
])