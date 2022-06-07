import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { Person } from 'shared/models/person';
import moment from 'moment';
import { RollStateIcon } from 'staff-app/components/roll-state/roll-state-icon.component';
import { RolllStateType } from 'shared/models/roll';
import { Activity } from 'shared/models/activity';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

function Row(props: { row: { id: number, name: string, completed_at: Date, student_roll_states: any } }) {
  const { row } = props;
  const classes = useRowStyles();

  const [activeTable, setActiveTable] = useState<number>(0);

  const toggle = (openTable: number) => {
    if (openTable === activeTable) {
      return setActiveTable(0);
    }
    setActiveTable(openTable)
  }

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => toggle(row.id)}>
            {activeTable === row.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{moment(row.completed_at).format('LLLL')}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={activeTable === row.id} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Students Rolls
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell>Fisr Name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell>Roll</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.student_roll_states.map((rollRow: { id: number, first_name: string, last_name: string, roll: RolllStateType }) => (
                    <TableRow key={rollRow.id}>
                      <TableCell>{rollRow.id}</TableCell>
                      <TableCell component="th" scope="row">
                        {rollRow.first_name}
                      </TableCell>
                      <TableCell>{rollRow.last_name}</TableCell>
                      <TableCell><RollStateIcon type={rollRow.roll ? rollRow.roll : 'unmark'} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function CollapsibleTable({
  data
}: { data: Activity[] }) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead style={{ background: '#343f64' }}>
          <TableRow>
            <TableCell />
            <TableCell style={{ color: '#fff' }}>Roll Name</TableCell>
            <TableCell style={{ color: '#fff' }} align="right">Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data && data.map((row: any) => (
            <Row key={row.name} row={row.entity} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
