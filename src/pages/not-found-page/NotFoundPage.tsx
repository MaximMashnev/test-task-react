import { Box, Button, Typography } from "@mui/material";

export default function NotFoundPage() {
    return (
        <Box sx={{ 
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh"
            }}>
            <Typography variant="h5" component="span">
                Страница не найдена
            </Typography>
            <Button variant="contained" href="/" sx={{ width: 300}}>На главную</Button>
        </Box>
    )
}