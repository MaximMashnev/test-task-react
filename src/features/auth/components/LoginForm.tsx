import { Box, Button, TextField, Typography } from "@mui/material";
import Container from "../../../shared/ui/Container";
import { useState } from "react";

export default function LoginForm () {

    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const test: boolean = false;

    function handleOnLogin() {
        console.log(login);
        console.log(password);
    }

    return (
        <Box 
            sx={{ 
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh"
            }}>
            <Container>
                <Typography variant="h6" component="span">
                    Авторизация
                </Typography>
                <TextField
                    error={test}
                    value={login}
                    onChange={e => setLogin(e.target.value)}
                    id="login"
                    label="Логин"
                    placeholder="example@ex.com"
                    helperText={test && "Неверный ввод."}
                    type="email"
                />
                <TextField
                    error={test}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    id="password"
                    label="Пароль"
                    placeholder="Password"
                    helperText={test && "Неверный ввод."}
                    type="password"
                />
                <Button variant="contained" onClick={handleOnLogin}>
                    Войти
                </Button>
            </Container>
        </Box>
    )
}