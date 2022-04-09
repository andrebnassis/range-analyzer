import React from 'react';
import { Story, Meta } from "@storybook/react";
import { IRange } from "../../../model/IRange";
import { TextField, Paper , Box, Typography, Stack, Button, Table, TableHead, TableBody, TableRow, TableCell, IconButton, Alert} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';
import cloneDeep from 'lodash.clonedeep'
import { isNumber } from '../../../service/number_utils';
import { getAvailableRanges } from '../../../service/range_handler';
// @ts-ignore
import mdx from './GetAvailableRanges.mdx';

export default {
  title: '2. Getting Started',
  parameters: {
    options: { showPanel: false },
    docs: {
      page: mdx,
    },
    controls:{
      disabled: true
    },
    actions:{
      disabled: true
    },
  },
} as Meta;

const Range: React.FC<{from: number|undefined, to: number|undefined, onChange:(data:IRange) => void }> = ({from, to, onChange}) => {
 
    const [data, setData] = React.useState<IRange>({from, to});
  
    const handleOnChange = (target:string, value:string) => {
      let newValue = isNumber(value) ? parseInt(value,10) : undefined;
      newValue = newValue === -0 ? 0 : newValue;
  
      switch(target){
        case 'from':
          if(data.from !== newValue){
          const newData = {...data, from: newValue};
          setData(newData);
          onChange(newData);
          }
          return;
        case 'to':
          if(data.to !== newValue){
          const newData = {...data, to: newValue};
          setData(newData);
          onChange(newData);
          }
          return;
        default:
          return;
      }
    }
  
    return (<>
      <Stack width={'150px'}>
        <Paper elevation={1} sx={{ padding: '5px 5px 5px 5px', ':hover':{
          boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)'
        } }}>
          <TextField size='small' label="from" defaultValue={from} placeholder={from?.toString()} helperText={data.from !== undefined ? data.from.toString() : '-Infinity'} onChange={(event) => handleOnChange('from',event.target.value)} sx={{ marginBottom: '10px' }} />
          <TextField size='small' label="to" defaultValue={to} placeholder={to?.toString()} helperText={data.to !== undefined ? data.to.toString() : '+Infinity'} onChange={(event) => handleOnChange('to',event.target.value)} sx={{ marginTop: '10px' }} />
        </Paper>
      </Stack>
    </>);
  };

  
interface ILockRange extends IRange {
    id: string,
    createdAt: number
}

interface IState {
    selection:IRange,
    limit: IRange,
    lockRanges:Array<ILockRange>
  };

const initialState:IState = {
    selection:{
      from: undefined,
      to: undefined
    },
    limit:{
      from:undefined,
      to:undefined
    },
    lockRanges:[]
}

  type ActionPayload = |
  {
    type: 'UPDATE_SELECTION',
    payload:IRange
  } |
  {
    type: 'UPDATE_LIMIT',
    payload:IRange
  } |
  {
    type: 'REMOVE_TARGET_LOCK_RANGE',
    payload:{
      id: string
    }
  } |
  {
    type: 'UPDATE_TARGET_LOCK_RANGE',
    payload: Omit<ILockRange, "createdAt">
  } |
  {
    type: 'ADD_LOCK_RANGE',
    payload: Omit<ILockRange, "createdAt">
  }
  |
  { type: 'SORT_LOCK_RANGES_BY_CREATED_DATE'
  }
  
  const rangeReducer = (state:IState, action:ActionPayload):IState => {
  
    switch(action.type){
      case 'UPDATE_SELECTION':{
        return {...state, selection: action.payload}
      }
      case 'UPDATE_LIMIT':{
        return {...state, limit: action.payload}
      }
      case 'REMOVE_TARGET_LOCK_RANGE':{
        const { lockRanges } = state;
        return {...state, lockRanges:[...lockRanges].filter(lockRange => lockRange.id !== action.payload.id)};
      }
      case 'UPDATE_TARGET_LOCK_RANGE':{
        const { lockRanges } = state;
        const targetLockRange = [...lockRanges].find(lockRange => lockRange.id === action.payload.id) as ILockRange;
        console.log({targetLockRange});
        const remainingLockRanges = [...lockRanges].filter(lockRange => lockRange.id !== action.payload.id);
        console.log({remainingLockRanges});
        return {...state, lockRanges: [...remainingLockRanges, {...action.payload, createdAt: targetLockRange.createdAt}]};
      }
      case 'ADD_LOCK_RANGE':{
        const { lockRanges } = state;
        console.log({lockRanges});
        return {...state, lockRanges: [...lockRanges, {...action.payload, createdAt:Date.now()}]};
      }
      case 'SORT_LOCK_RANGES_BY_CREATED_DATE':{
        const { lockRanges } = state;
        return {...state, lockRanges: lockRanges.sort((a, b) => {
          return a.createdAt - b.createdAt;
        })};
      }
      default:
        return {...state};
    }
  }

  const EditRangeDialog:React.FC<{open: boolean, title:string, from:number|undefined, to:number|undefined, onApply:(data: IRange) => void, onClose:(event: any, reason: "backdropClick" | "escapeKeyDown" | "closeButton") => void}> = ({ open, title, from, to, onApply, onClose}) => {
  
    const [range, setRange] = React.useState<IRange>({from, to});
    
    return(<Dialog 
      open={open}
      onClose={onClose}>
        <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-around'} sx={{paddingLeft: '5px', paddingRight: '5px'}}>
        <Button color={
  'error'
        }
        onClick={(event:any) => onClose(event, 'closeButton')}
        >Cancel</Button>
        <DialogTitle>{title}</DialogTitle>
        <Button 
         disabled={(range.from === from) && (range.to === to)}
         onClick={(event:any) => onApply(range)}>Apply</Button>
        </Stack>
      <DialogContent dividers >
        <Stack alignItems={'center'} justifyContent={'center'}>
          <Range from={from} to={to} onChange={(data:IRange) => setRange(data)} />
      </Stack>
      </DialogContent>
    </Dialog>);
  }
  
  

export const GetAvailableRanges:Story = () => {
  
  const [state, dispatch] = React.useReducer(rangeReducer, initialState);

  const [result, setResult] = React.useState<Array<IRange>|null>(null);

  const [targetDialog, setTargetDialog] = React.useState<'selection'|'limit'|'lock-range'|''>('');
  const [targetDialogCustomData, setTargetDialogCustomData] = React.useState<ILockRange|undefined>(undefined);
  
  const handleSetTargetDialog = (context:'selection'|'limit'|'lock-range'|'', customData?:ILockRange):void => {
    setTargetDialog(context);
    setTargetDialogCustomData(customData);
  }

  const isTargetDialogContextOpen = (context:'selection'|'limit'|'lock-range'|'') => context === targetDialog;

  const handleAddLockRange = (event:MouseEvent) => {
    event.preventDefault();
    
    dispatch({type: 'ADD_LOCK_RANGE', payload: {
      id: uuidv4(),
      from:undefined,
      to:undefined
    }});
    
  }

  React.useEffect(() => {
    dispatch({type: 'SORT_LOCK_RANGES_BY_CREATED_DATE'});
  },[state.lockRanges])

  return (
  <Stack spacing={2}>
    <Alert severity="info"><Typography variant={'body1'} >Click on <Typography fontWeight={'bold'} component={'span'} sx={{}}>Docs tab</Typography> for getAvailableRanges API DOCS</Typography></Alert>
    <Stack flexDirection='row' justifyContent={'space-around'} flexWrap='wrap'>

  <Stack sx={{maxWidth:'30vw'}}>
  <Typography variant="h3">PLAYGROUND</Typography>
  <Typography variant="h4">Instructions</Typography>
  <Typography variant="body1">Here you can:</Typography>
  <Typography variant="body2">
    <ul>
      <li>
        Set Selection
      </li>
      <li>
        Set Limit
      </li>
      <li>
        Add/Edit/Remove LockRanges
      </li>
    </ul>
  </Typography>
  <Typography variant="body1">Then, click on <Typography component={'span'} sx={{color:'blue'}}>RUN</Typography> button to call getAvailableRanges and shows the result on an alert dialog</Typography>
  </Stack>
  <Stack spacing={2}>
      <Button variant='contained' type='button' sx={{width:'fit-content'}} onClick={(event) => {alert(JSON.stringify(getAvailableRanges(cloneDeep(state.lockRanges), cloneDeep(state.selection), cloneDeep(state.limit))));}}>RUN</Button>
      <Stack alignItems={'flex-start'} spacing={2}>
   <Box>
    <Typography variant="h6">Selection</Typography>
    <EditRangeDialog open={isTargetDialogContextOpen('selection')} title={'Selection'} from={state.selection.from} to={state.selection.to} onApply={(data) => dispatch({type: 'UPDATE_SELECTION', payload: data})} onClose={(props:any) => handleSetTargetDialog('')}/>
    <Table size="small" sx={{width:'fit-content'}}>
        <TableHead>
          <TableRow>
            <TableCell>
              From
            </TableCell>
            <TableCell>
              To
            </TableCell>
            <TableCell/>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              {state.selection.from ?? '-Infinity'}
            </TableCell>
            <TableCell>
              {state.selection.to ?? '+Infinity'}
            </TableCell>
            <TableCell>
              <IconButton size={"small"} onClick={(props:any) => handleSetTargetDialog('selection')}>
                  <EditIcon fontSize={"inherit"}/>
              </IconButton>
            </TableCell>
          </TableRow>
        </TableBody>
    </Table>
   </Box>
   <Box>
    <Typography variant="h6">Limit</Typography>
    <EditRangeDialog open={isTargetDialogContextOpen('limit')} title={'Limit'} from={state.limit.from} to={state.limit.to} onApply={(data) => dispatch({type: 'UPDATE_LIMIT', payload: data})} onClose={(props:any) => handleSetTargetDialog('')}/>
    <Table size="small" sx={{width:'fit-content'}}>
        <TableHead>
          <TableRow>
            <TableCell>
              From
            </TableCell>
            <TableCell>
              To
            </TableCell>
            <TableCell/>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              {state.limit.from ?? '-Infinity'}
            </TableCell>
            <TableCell>
              {state.limit.to ?? '+Infinity'}
            </TableCell>
            <TableCell>
              <IconButton size={"small"} onClick={(props:any) => handleSetTargetDialog('limit')}>
                  <EditIcon fontSize={"inherit"}/>
              </IconButton>
            </TableCell>
          </TableRow>
        </TableBody>
    </Table>
   </Box>
   <Box>
    <Stack flexDirection='row' justifyContent={'stretch'} alignItems={'center'}>
   <Typography variant="h6">LockRanges</Typography>
   <IconButton sx={{
     paddingTop:0,
     paddingBottom:0,
     ':hover':{
   backgroundColor:'transparent'
   }}} size={"large"} onClick={(event:any) => handleAddLockRange(event)}>
        <AddBoxRoundedIcon  fontSize={"inherit"}/>
    </IconButton>
    </Stack>
   <EditRangeDialog open={isTargetDialogContextOpen('lock-range')} title={'Lock Range'} from={targetDialogCustomData?.from} to={targetDialogCustomData?.to} onApply={(data) => 
     dispatch({type: 'UPDATE_TARGET_LOCK_RANGE', payload:{
      id: targetDialogCustomData?.id as string,
      from: data.from, 
      to: data.to
    }})}
    onClose={(props:any) => handleSetTargetDialog('')}/>
   <Table size="small" sx={{width:'fit-content'}}>
        <TableHead>
          <TableRow>
            <TableCell>
              From
            </TableCell>
            <TableCell>
              To
            </TableCell>
            <TableCell/>
          </TableRow>
        </TableHead>
        <TableBody>
        {state.lockRanges.map((lockRange, index) => (
          <TableRow key={`lock-range-${index}`}>
            <TableCell>
              {lockRange.from ?? '-Infinity'}
            </TableCell>
            <TableCell>
              {lockRange.to ?? '+Infinity'}
            </TableCell>
            <TableCell>
              <IconButton size={"small"} onClick={(props:any) => handleSetTargetDialog('lock-range', lockRange)}>
                  <EditIcon fontSize={"inherit"}/>
              </IconButton>
              <IconButton size={"small"} onClick={(props:any) => 
              dispatch({type: 'REMOVE_TARGET_LOCK_RANGE', payload:{
                id: lockRange.id
              }})
              }>
                  <DeleteIcon fontSize={"inherit"}/>
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
        </TableBody>
    </Table>
   </Box>
    </Stack>
  </Stack>
  </Stack>
  </Stack>
  );

  
}