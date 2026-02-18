import { Alert, Box, Button, TextField, Typography, IconButton } from "@mui/material";
import Container from "../../../shared/ui/Container";
import { useState } from "react";
import bgImage from "../../../shared/assets/imgs/bgImage.jpg";
import { useNavigate } from "react-router";
import authService from "../services";
import { PATHS, STORAGE_KEYS } from "../../../shared/consts";
import HomeIcon from '@mui/icons-material/Home';

export default function LoginForm () {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [touched, setTouched] = useState({login: false, password: false})

    const isLoginValid = login.length >= 4;
    const isPasswordValid = password.length >= 8;

    const showLoginError = touched.login && !isLoginValid;
    const showPasswordError = touched.password && !isPasswordValid;

    const authUser = () => {
        setIsLoading(true);
        setError("");
        authService.login({login, password})
            .then(
                (data) => {
                    localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
                    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.data));
                    navigate(`/${PATHS.TOOLPAD}/`);                
            })
            .catch(
                (error) => {
                    const message = error.response.data.message ?? "Ошибка авторизации";
                    setError(message);                
            })
            .finally(
                () => {
                    setIsLoading(false);
            })
    }   

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        authUser();
    }

    return (
        <Box 
            sx={{ 
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                position: "relative", 
                '&::before': {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "blur(2px)",
                    zIndex: -1,
                }
            }}>
            <Container>
                <Box sx={{display: "flex", justifyContent: "space-between"}}>
                    <Typography variant="h6" component="span">
                        Авторизация
                    </Typography>
                    <IconButton href="/" title="На главную">
                        <HomeIcon />
                    </IconButton>
                </Box>
                {error && <Alert severity="error">{error}</Alert>}
                <Box 
                    onSubmit={handleSubmit}
                    component="form" 
                    sx={{
                        display: "flex",
                        width: "100%",
                        flexDirection: "column",
                        gap: "1rem"
                    }}
                >
                    <TextField
                        value={login}
                        onChange={e => setLogin(e.target.value)}
                        label="Логин"
                        placeholder="example@ex.com"
                        onBlur={() => {setTouched(prev => ({ ...prev, login: true}))}}
                        error={showLoginError}
                        helperText={showLoginError && "Минимальная длина 4 символа"}
                        type="email"
                        disabled={isLoading}
                    />
                    <TextField
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        label="Пароль"
                        placeholder="Password"
                        onBlur={() => {setTouched(prev => ({ ...prev, password: true}))}}
                        error={showPasswordError}
                        helperText={showPasswordError && "Минимальная длина 8 символов"}
                        type="password"
                        disabled={isLoading}
                    />
                    <Button 
                        type="submit" 
                        variant="contained" 
                        loading={isLoading}
                        disabled={(isLoginValid && isPasswordValid) ? false : true}
                    >
                        Войти
                    </Button>                    
                </Box>    
            </Container>
        </Box>
    )
}