import React, { useState,useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import style from './AddData.module.css';
import style2 from './ShowData.module.css';
import './ShowData.css';
import { Card } from '@material-ui/core';

export default function ShowData(props) {
  const { patientBioMedList, patientId } = props;
  const [loginId,setLoginId] = useState('');
  useEffect(() => {
    // Fetching the current URL using window.location
    const url = window.location.pathname;
    const trim = url.slice(1);
    setLoginId(trim)
  }, []);

  const formatDate = (dateString) => {
    if (dateString === "" || dateString === undefined) return undefined;

    const dateObj = new Date(dateString);
    const date = dateObj.getDate();
    const month = dateObj.getMonth();
    const year = dateObj.getFullYear();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDate = new Date().getDate();
    let age = currentYear - year;
    age = currentDate >= date && currentMonth >= month ? age : age - 1;

    return `${date}/${month + 1}/${year} ${age}yrs`;
  };

  // Filter data based on patientId
  const filteredData = patientBioMedList.filter(data => data.id === loginId);
  // console.log(filteredData,"lalala")
  // Log filtered data into console
  console.log('Filtered data:', filteredData);

  return (
    <div className={style2.showDataContainer}>
      <Card className={style2.card}>
        <div className="card-container">
        <h2 className={style.h2}>Patient's Medical Data</h2>
        <TableContainer component={Paper}>
          <Table className={style.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Sno.</TableCell>
                <TableCell>Disease Name</TableCell>
                <TableCell>Weight</TableCell>
                <TableCell style={{minWidth:'200px'}}>Disease Description</TableCell>
                <TableCell>Disease StartedOn</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">{index + 1}</TableCell>
                  {/* <TableCell>{row.name}</TableCell> */}
                  {/* <TableCell>{formatDate(row.birthDate)}</TableCell> */}
                  {/* <TableCell>{row.phoneNumber}</TableCell> */}
                  {/* <TableCell>{row._address}</TableCell> */}
                  
                  {/* <TableCell>{row.height}</TableCell> */}
                  {/* <TableCell>{row.bloodGroup}</TableCell> */}
                  <TableCell>{row.diseaseName}</TableCell>
                  <TableCell>{row.weight}</TableCell>
                  <TableCell>{row.diseaseDescription}</TableCell>
                  <TableCell>{formatDate(row.diseaseStartedOn)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </div>
      </Card>
    </div>
  );
}