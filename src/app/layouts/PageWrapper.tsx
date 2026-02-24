import { Suspense, FC, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";

interface PageWrapperProps {
    title: string;
    component: React.ComponentType;
}

export const PageWrapper: FC<PageWrapperProps> = ({title, component: Component}) => {
    useEffect(() => {document.title = title}, [title]);

    return (
        <Suspense 
            fallback={
                <Box sx={{ display: 'flex', alignItems: "center", justifyContent: "center", height: "calc(100vh - 100px)" }}>
                    <CircularProgress size="4rem" />
                </Box>        
            }>
            <Component />
        </Suspense>
    )
}