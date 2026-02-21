import { DataGrid, GridActionsCell, GridActionsCellItem, GridColDef, GridRenderCellParams} from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import buildingsStore from '../../entities/Buildings/model/store';
import { useEffect, useState } from 'react';
import { observer } from "mobx-react-lite"
import { Button, Container } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BuildingFormDialog from '../../features/BuildingForm/ui/BuildingFormDialog';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import { BuildingEntity } from '../../entities/Buildings';
import BuildingService from '../../entities/Buildings/services/buildings.service';

const BuildingsPage = observer(() => {

  const columns: GridColDef[] = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 70,
      filterable: false
    },
    { 
      field: 'name', 
      headerName: 'Название', 
      type: 'longText',
      flex: 1
    },
    { 
      field: 'address', 
      headerName: 'Адрес',
      type: 'longText',
      flex: 1
    },
    {
      field: 'dateRegistration',
      headerName: 'Дата регистрации',
      flex: 1,
    },
    {
      field: 'numberApplications',
      headerName: 'Количество поданных заявок',
      type: 'number',
      flex: 1,
      filterable: false
    },
    {
      field: 'actions',
      headerName: 'Действия',
      filterable: false,
      sortable: false,
      renderCell: (params) => <ActionsCell {...params} />,
    }
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState<BuildingEntity | null>(null);

  useEffect(() => {
    buildingsStore.getBuildings();
  }, [])

  const handleOpenDialog = () => {
    setEditData(null);
    setOpenDialog(true);
  }

  const handleEditClick = (building: BuildingEntity) => {
    setEditData(building);
    setOpenDialog(true);
  }

  const handleDeleteClick = async (building: BuildingEntity) => {
    try {
      await BuildingService.delBuilding(building);
      window.alert("Объект был удален.")
    }
    catch (error) {
      window.alert("Ошибка при удалении объекта.")
    }
  }  

  const ActionsCell = (props: GridRenderCellParams) => {
    return (
      <GridActionsCell {...props}>
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          className="textPrimary"
          onClick={() => handleEditClick(props.row)}
          color="inherit"
        />
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDeleteClick(props.row)}
          color="inherit"
        />
      </GridActionsCell>
    );
  }

  return (
    <>
      <Paper sx={{ height: "auto", width: '100%' }}>
      <Container sx={{
          display:'flex', 
          flexDirection: "row", 
          justifyContent: "space-between", 
          margin: 0, 
          paddingBottom: "6px", 
          width: "100%",
          '@media(min-width: 600px)' : {
            p: 0,
            paddingBottom: "6px",
            width: "100%",
          },
        }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenDialog}>
          Новый объект
        </Button >
      </Container>
        <DataGrid
            rows={buildingsStore.buildings}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            sx={{ border: 0 }}
            // TODO Убрать всё, кроме фильтра в showToolbar
            showToolbar
        />      
      </Paper>
      <BuildingFormDialog open={openDialog} data={editData} onClose={() => setOpenDialog(false)}/>    
    </>
  )
})

export default BuildingsPage;