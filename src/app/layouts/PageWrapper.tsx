import { Suspense, FC, useEffect } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Box from "@mui/material/Box";

interface PageWrapperProps {
    title: string;
    component: React.ComponentType;
}

export const PageWrapper: FC<PageWrapperProps> = ({title, component: Component}) => {
    useEffect(() => {document.title = title}, [title]);

    return (
        <Suspense 
            fallback={
                <Box sx={{ display: 'flex', alignItems: "center", justifyContent: "center" }}>
                    <CircularProgress />
                </Box>
            }>
            <Component />
        </Suspense>
    )
}