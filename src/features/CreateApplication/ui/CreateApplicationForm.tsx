import { 
    Alert, 
    Box, 
    Button, 
    Container, 
    FormControl, 
    IconButton, 
    InputLabel, 
    MenuItem, 
    OutlinedInput, 
    Select, 
    styled, 
    TextField, 
    Typography, 
} from "@mui/material";
import { useEffect, useState } from "react";
import HomeIcon from '@mui/icons-material/Home';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { LevelCriticality } from "../../../entities/Application/model/types";
import applicationsStore from "../../../entities/Application/model/store";
import { LvlCriticality } from "../../../entities/Application/consts";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function CreateApplicationForm () {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [email, setEmail] = useState("");
    const [category, setCategory] = useState("");
    const [levelCriticality, setLevelCriticality] = useState<LevelCriticality>(LvlCriticality[0]);
    const [files, setFiles] = useState<FileList>();

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        console.log(priorityСalculation())
        console.log("Submit");
    }

    useEffect(() => {
        applicationsStore.getApplicationsCategories();     
    }, [])

    const priorityСalculation = () => {
        let priority = levelCriticality.score;
        const categoryItem = applicationsStore.categories.find(item => category === item.name);
        if (categoryItem) {
            priority += categoryItem.score;
        }
        if (description.length >= 50) {
            priority += description.length >= 200 ? 2 : 1;
        }
        if (files?.length) {
            priority += files.length >= 3 ? 2 : 1;
            if (Array.from(files).some(f => f.type.startsWith('video/'))) priority += 1;
        }
        const dateHours = new Date().getHours();
        priority += (dateHours < 22 && dateHours > 6) ? 0 : 2;
        return priority;
    }

    return (
        <Container sx={{width: 600, bgcolor: "white", borderRadius: "16px", padding: "12px"}}>
            <Box sx={{display: "flex", justifyContent: "space-between"}}>
                <Typography variant="h6" component="span">
                    Создание заявки
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
                    value={name}
                    onChange={e => setName(e.target.value)}
                    label="Название проблемы"
                    required
                    type="text"
                    disabled={isLoading}
                />       
                <TextField
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    label="Подробное описание проблемы"
                    multiline
                    maxRows={4}
                    required
                    type="text"
                    disabled={isLoading}
                />         
                <TextField
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    label="Email для обратной связи"
                    placeholder="example@ex.com"
                    required
                    type="email"
                    disabled={isLoading}
                />
                <FormControl sx={{ m: 0}}>
                    <InputLabel>Категория проблемы</InputLabel>
                    <Select
                        required
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        input={<OutlinedInput label="Категория проблемы" />}
                        MenuProps={MenuProps}
                        >
                            {applicationsStore.categories.map((category) => (
                                <MenuItem
                                    key={category.id}
                                    value={category.name}
                                >
                                    {category.name}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ m: 0}}>
                    <InputLabel>Уровень критичности</InputLabel>
                    <Select
                        required
                        value={levelCriticality.level}
                        onChange={e => setLevelCriticality(LvlCriticality.find((item) => item.level === e.target.value)!)}
                        input={<OutlinedInput label="Уровень критичности" />}
                        MenuProps={MenuProps}
                        >
                            {LvlCriticality.map((level, index) => (
                                <MenuItem
                                    key={index}
                                    value={level.level}
                                >
                                    {level.level}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
                <Button
                    component="label"
                    role={undefined}
                    variant="outlined"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                    >
                    Загрузить файлы
                    <VisuallyHiddenInput
                        type="file"
                        onChange={e => setFiles(e.target.files as unknown as FileList)}
                        multiple
                    />
                </Button>
                <Button 
                    type="submit" 
                    variant="contained" 
                    loading={isLoading}
                    disabled={isLoading}
                >
                    Отправить заявку
                </Button>                    
            </Box>    
        </Container>        
    )
}  
