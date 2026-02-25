import { 
  DataGrid, 
  getGridDateOperators, 
  getGridNumericOperators, 
  getGridSingleSelectOperators, 
  GridActionsCell, 
  GridActionsCellItem, 
  GridColDef,
  GridFilterInputDate,
  GridFilterInputValue, 
  GridFilterModel,
  GridPaginationModel, 
  GridRenderCellParams, 
  GridSortModel, 
  GridToolbarContainer, 
  GridToolbarFilterButton
} from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import { observer } from "mobx-react-lite"
import { Button, Snackbar} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { GridSortItem } from '@mui/x-data-grid/models/gridSortModel';
import { ApplicationEntity } from '../../entities/Application';
import applicationsStore from '../../entities/Application/model/store';
import RejectApplicationDialog from '../../features/EditApplication/ui/RejectApplicationDialog';
import ConstructionIcon from '@mui/icons-material/Construction';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ApplicationStatus } from '../../entities/Application/model/types';
import buildingsStore from '../../entities/Buildings/model/store';

interface SnackbarAlert {
  open: boolean;
  message: string;
}

interface mapBuildings {
  label: string;
  value: number;
}

const ApplicationPage = observer(() => {
  const mapBuildings: mapBuildings[] = [];
  buildingsStore.buildings.forEach(b => {
    mapBuildings.push({label: b.name, value: b.id});
  })
  // Фильтрация заявок (Периоду дат (нет в моках и в grid), Наличию прикрепленных файлов (нет в моках))
  const columns: GridColDef<ApplicationEntity>[] = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 70,
      filterable: false
    },
    { 
      field: 'name', 
      headerName: 'Название заявки', 
      type: 'longText',
      flex: 1,
      filterable: false
    },
    { 
      field: 'description', 
      headerName: 'Описание проблемы',
      type: 'longText',
      flex: 1,
      filterable: false
    },
    {
      field: 'email',
      headerName: 'Email заявителя',
      flex: 1,
      type: "string",
      filterable: false
    },
    {
      field: 'dateSubmission',
      headerName: 'Дата подачи',
      flex: 1,
      type: "date",
      valueFormatter: (value) => {return new Date(value).toLocaleString()},
      filterOperators: getGridDateOperators().filter(
        (operator) => operator.value === "is"
      ),
    },
    {
      field: 'status',
      headerName: 'Статус',
      type: 'singleSelect',
      flex: 1,
      filterOperators: getGridSingleSelectOperators()
        .filter((operator) => operator.value === 'is')
        .map((operator) => ({
          ...operator,
          label: 'Равен',
        })),
      valueOptions: [
        ApplicationStatus.new,
        ApplicationStatus.inProgress,
        ApplicationStatus.completed,
        ApplicationStatus.rejected,
      ],
    },
    {
      field: 'building_id',
      headerName: 'Объект',
      type: 'singleSelect',
      flex: 1,
      valueFormatter: (value) => {return buildingsStore.buildings.find(b => b.id === value)?.name},
      filterOperators: getGridSingleSelectOperators()
        .filter((operator) => operator.value === 'is')
        .map((operator) => ({
          ...operator,
          label: 'Равен',
        })),
      valueOptions: mapBuildings,
    },
    {
      field: 'upload_id',
      headerName: 'Есть прикрепленные файлы',
      type: 'boolean',
      flex: 1,
      valueGetter: (value: Array<number>) => {
        if (value?.length >= 1) {
          return true;
        }
        return false
      }
    },
    {
      field: 'priority',
      headerName: 'Приоритет',
      type: 'number',
      flex: 1,
      filterOperators: getGridNumericOperators()
        .filter((operator) => operator.value === '=')
        .map((operator) => ({
          ...operator,
          label: 'Равен',
        })),
    },
    {
      field: 'actions',
      headerName: 'Действия',
      type: "actions",
      filterable: false,
      sortable: false,
      renderCell: (params) => <ActionsCell {...params} />,
    }
  ];

  const ActionsCell = (props: GridRenderCellParams<ApplicationEntity>) => {
    return (
      <GridActionsCell {...props}>
        {props.row.status === "новый" &&
          <GridActionsCellItem
            icon={<ConstructionIcon />}
            label="Принять в работу"
            title="Принять в работу"
            onClick={() => handleTakeOnJob(props.row)}
            color="inherit"
          />
        }
        {props.row.status === "в работе" &&
          <>
            <GridActionsCellItem
              icon={<CheckCircleIcon />}
              label="Отметить как выполненную"
              title="Отметить как выполненную"
              onClick={() => handleSuccess(props.row)}
              color="inherit"
            />
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Отклонить с указанием причины"
              title="Отклонить с указанием причины"
              onClick={() => handleReject(props.row)}
              color="inherit"
            />               
          </>
        }
      </GridActionsCell>
    );
  };

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarFilterButton />
        <Button variant="text" startIcon={<RefreshIcon />} onClick={() => applicationsStore.getApplications()}>
          Обновить
        </Button >
      </GridToolbarContainer>
    );
  }

  const [snackbarAlert, setSnackbarAlert] = useState<SnackbarAlert>({open: false, message: ""});
  const [openDialog, setOpenDialog] = useState(false);
  const [applicationData, setApplicationData] = useState<ApplicationEntity>(applicationsStore.applications[0]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({page: 0, pageSize: 5});
  const [sortModel, setSortModel] = useState<GridSortItem>({field: "id", sort: "asc"});
  const [filterModel, setFilterModel] = useState<GridFilterModel | null>(null);

  useEffect(() => {
    applicationsStore.filter = filterModel;
    applicationsStore.pagination = paginationModel;
    applicationsStore.sort = sortModel;
    applicationsStore.getApplications();
    buildingsStore.getAllBuildings();
  }, [paginationModel, sortModel, filterModel])

  const handleTakeOnJob = async (application: ApplicationEntity) => {
    const jobStatusApplication: ApplicationEntity = {
      ...application,
      status: ApplicationStatus.inProgress,
      dateInProgress: new Date()
    }
    try {
      await applicationsStore.editApplication(jobStatusApplication);
      setSnackbarAlert({open: true, message: `Статус заявки ${jobStatusApplication.id} успешно изменен!`})
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ошибка при смене статуса заявки"
      setSnackbarAlert({open: true, message: errorMessage})
    }
  }

  const handleSuccess = async (application: ApplicationEntity) => {
    const successStatusApplication: ApplicationEntity = {
      ...application,
      status: ApplicationStatus.completed,
      dateResult: new Date()
    }
    try {
      await applicationsStore.editApplication(successStatusApplication);
      setSnackbarAlert({open: true, message: `Статус заявки ${successStatusApplication.id} успешно изменен!`})
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ошибка при смене статуса заявки"
      setSnackbarAlert({open: true, message: errorMessage})
    }
  }

  const handleReject = (application: ApplicationEntity) => {
    setApplicationData(application);
    setOpenDialog(true);
  }

  return (
    <>
      <Paper sx={{ height: "auto", width: '100%' }}>
        <DataGrid
            rows={applicationsStore.applications}
            columns={columns}
            initialState={{ pagination: {paginationModel} }}
            pageSizeOptions={[5, 10]}
            paginationMode='server'
            onPaginationModelChange={(model: GridPaginationModel) => setPaginationModel(model)}
            rowCount={applicationsStore.meta.total_items ?? 0}
            sortingMode="server"
            onSortModelChange={([model]: GridSortModel) => setSortModel(model)}
            filterMode='server'
            onFilterModelChange={(model: GridFilterModel) => setFilterModel(model)}
            sx={{ border: 0 }}
            showToolbar
            slots={{toolbar: CustomToolbar}}
        />      
      </Paper>
      <RejectApplicationDialog open={openDialog} data={applicationData!} onClose={() => setOpenDialog(false)}/>   
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center"}}
        autoHideDuration={4000}
        open={snackbarAlert.open}
        onClose={() => setSnackbarAlert({open: false, message: ""})}
        message={snackbarAlert.message}
      />
    </>
  )
})

export default ApplicationPage;