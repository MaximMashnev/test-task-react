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
import { ApplicationCategory, ApplicationStatus, LevelCriticality, NewApplication } from "../../../entities/Application/model/types";
import applicationsStore from "../../../entities/Application/model/store";
import { LvlCriticality } from "../../../entities/Application/consts";
import { MAX_FILES, MAX_SIZE_MB, PATHS } from "../../../shared/consts";
import buildingsStore from "../../../entities/Buildings/model/store";
import { observer } from "mobx-react-lite";
import { BuildingEntity } from "../../../entities/Buildings";
import { FileDTO } from "../../../entities/Application/services/dto";
import { useNavigate } from "react-router-dom";
import { IncrementNumAppsBuilding } from "../../../entities/Buildings/model/types";

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

const CreateApplicationForm = observer(() => {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [building, setBuilding] = useState<BuildingEntity | undefined>();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [email, setEmail] = useState({value: "", touched: false});
    const [category, setCategory] = useState<ApplicationCategory | undefined>();
    const [levelCriticality, setLevelCriticality] = useState<LevelCriticality | undefined>();
    const [files, setFiles] = useState<FileList>();

    const isEmailValid = email.value.split("@")[0].length > 4;
    const showEmailError = !isEmailValid && email.touched;

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            let filesData: number[] = [];
            if (files &&  files.length > 0) {
                filesData = await uploadedFiles();
                if (filesData.length === 0) {
                    setIsLoading(false);
                    setError("Не удалось загрузить файлы, попробуйте ещё раз.")
                    return;
                } 
            }

            const priorityResult = priorityСalculation();

            const newApplication: NewApplication = {
                name: name,
                description: description,
                email: email.value,
                dateSubmission: priorityResult.createdAt,
                status: ApplicationStatus.new,
                building_id: building!.id,
                upload_id: filesData,
                priority: priorityResult.priority,
                category: category!.id,
            }

            const data = await applicationsStore.addApplication(newApplication);
            const incrementNumApps: IncrementNumAppsBuilding = {
                ...building!,
                numberApplications: building!.numberApplications + 1
            }
            await buildingsStore.incrementNumApps(incrementNumApps);
            const link = applicationsStore.linkGeneration(data!);
            navigate(`../${PATHS.APPLICATION_TRACKING}/${link}`)
        }
        catch (error) {
            setError(error instanceof Error ? error.message : "Ошибка при создании заявки")
        }
        finally{
            setIsLoading(false);
        }

    }

    const uploadedFiles = async () => {
        const uploadedFiles = await Promise.all(
            Array.from(files!).map(async (value) => {
                try {
                    const fileData = await applicationsStore.uploadFileApplication(value);
                    return fileData;
                }
                catch (error) {
                    console.log(error instanceof Error ? error.message : `Ошибка загрузки файла ${value.name}`);
                    return null;
                }
            }
        ));
        return uploadedFiles.filter((dto): dto is FileDTO => dto !== undefined && dto !== null).map(dto => dto.id);
    }

    const handleFileInput = (files: FileList | null) => {
        if (!files) return;

        if (files.length > MAX_FILES) {
            setError(`Выбрано более ${MAX_FILES} файлов`)
            return;
        }

        if (Array.from(files).some(f => f.size > MAX_SIZE_MB * 1024 * 1024)) {
            setError(`Максимальный размер одного файла ${MAX_SIZE_MB} МБ`)
            return;
        }

        setFiles(files);
        setError("");
    }

    useEffect(() => {
        getData();
    }, [])

    const getData = async () => {
        await Promise.all([
            applicationsStore.getApplicationsCategories(),
            applicationsStore.getAllApplications(),
            buildingsStore.getAllBuildings(),
        ])
    }

    const priorityСalculation = () => {
        let priority = levelCriticality!.score;
        priority += category!.score;

        if (description.length >= 50) {
            priority += description.length >= 200 ? 2 : 1;
        }

        if (files?.length) {
            priority += files.length >= 3 ? 2 : 1;
            priority += Array.from(files).some(f => f.type.startsWith('video/')) ? 1 : 0;
        }

        const createdAt = new Date();
        priority += (createdAt.getHours() < 22 && createdAt.getHours() > 6) ? 0 : 2;

        priority += applicationsStore.applications.some(a => 
            a.building_id === building!.id && a.category === category!.id
        ) ? 2 : 0;

        priority += buildingsStore.buildings.some(b => 
            b.numberApplications > building!.numberApplications
        ) ? 0 : 1;

        priority = Math.min(priority, 10);

        return {priority, createdAt};
    }

    return (
        <>
            <Container sx={{width: 600, bgcolor: "white", borderRadius: "16px", padding: "12px"}}>
                <Box sx={{display: "flex", justifyContent: "space-between"}}>
                    <Typography variant="h6" component="span">
                        Создание заявки
                    </Typography>
                    <IconButton href={PATHS.MAIN} title="На главную">
                        <HomeIcon />
                    </IconButton>
                </Box>
                {error && <Alert severity="error" sx={{marginBottom:"16px"}}>{error}</Alert>}
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
                    <FormControl sx={{ m: 0}}>
                        <InputLabel>Строительный объект</InputLabel>
                        <Select
                            required
                            value={building?.name}
                            onChange={e => setBuilding(buildingsStore.buildings.find(b => b.id === e.target.value as unknown as number))}
                            input={<OutlinedInput label="Строительный объект" />}
                            >
                            {buildingsStore.buildings ?
                                buildingsStore.buildings.map(b => (
                                    <MenuItem
                                        key={b.id}
                                        value={b.id}
                                    >
                                        {b.name}
                                    </MenuItem>
                                ))
                                :
                                <MenuItem
                                    disabled={true}
                                >
                                    Загрузка...
                                </MenuItem>
                            }
                        </Select>
                    </FormControl>
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
                        value={email.value}
                        onChange={e => setEmail({value: e.target.value, touched: true})}
                        error={showEmailError}
                        helperText={showEmailError && "Минимальная длина имени почты (до @) 4 символа"}
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
                            onChange={e => setCategory(applicationsStore.categories.find(c => c.id === e.target.value as unknown as number))}
                            input={<OutlinedInput label="Категория проблемы" />}
                            >
                            {applicationsStore.categories ?
                                applicationsStore.categories.map((category) => (
                                    <MenuItem
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </MenuItem>
                                ))
                                :
                                <MenuItem
                                    disabled={true}
                                >
                                    Загрузка...
                                </MenuItem>
                            }

                        </Select>
                    </FormControl>
                    <FormControl sx={{ m: 0}}>
                        <InputLabel>Уровень критичности</InputLabel>
                        <Select
                            required
                            value={levelCriticality?.level}
                            onChange={e => setLevelCriticality(LvlCriticality.find((item) => item.level === e.target.value))}
                            input={<OutlinedInput label="Уровень критичности" />}
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
                            accept="image/*, video/*"
                            onChange={e => handleFileInput(e.target.files)}
                            multiple
                        />
                    </Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        loading={isLoading}
                        disabled={isLoading || Boolean(error)}
                    >
                        Отправить заявку
                    </Button>                    
                </Box>    
            </Container>    
        </>    
    )
}) 

export default CreateApplicationForm;