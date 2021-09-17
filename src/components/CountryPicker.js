//1
// BarChart

import React, { useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';


// Country
const useStylesCountry = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));


// Grid
const useStylesGrid = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }));
  
  //Data
  const useStylesGlobal = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(1),
        width: "100%",
        height: theme.spacing(16),
      },
    },
  }));
  
  const useTypo = makeStyles({
      root: {
        width: '100%',
        maxWidth: 500,
      },
    });



export default function CountryPicker() {
  const classesCountry = useStylesCountry();
  const classesGrid = useStylesGrid();
  const [countryName, setCountryName] = useState("");
  const [state, setState] = useState("Global");
  const [getData, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [lineChart, setLineChart] = useState([])

  // Global
  const classesGlobal = useStylesGlobal();
  const classesTypo = useTypo();

  // country
  useEffect( ()=> {
      const fetchCountry = async () => {
          try{
            const apiResponse = await fetch(`https://covid19.mathdro.id/api/countries`);
            const { countries } = await apiResponse.json();
            setCountryName(countries);
           
            }
          catch (error){
            console.log(error);
          }
      }
      fetchCountry();
  }, [] )


  //GlobalData
  useEffect( ()=> {
    const fetchData = async () => {
        let apiResponse;

        if(state === "Global"){
            apiResponse = await fetch("https://covid19.mathdro.id/api");
        }
        else{
            apiResponse = await fetch(`https://covid19.mathdro.id/api/countries/${state}`);
        }

        const apiData = await apiResponse.json();

        setData( apiData );

    }
    fetchData();
}, [state] )


    // Chart
    useEffect( () => {
      const fetchChart = async () => {
        const apiDaily = await fetch("https://covid19.mathdro.id/api/daily");
        const dailyData = await apiDaily.json();

        setLineChart(dailyData);

        setTimeout(setLoading(false), 2000);
        // setLoading(false);
      }
      fetchChart();
    }, [state] )


  const lineData = {
    labels: lineChart.map( date => date.reportDate ),
    datasets: [
      {
        label: 'Active',
        data: lineChart.map( date => date.confirmed.total ),
        fill: false,
        backgroundColor: 'rgba(218, 165, 32, 0.6)',
        borderColor: 'rgb(218, 165, 32)',
      },
      {
        label: 'Recovered',
        data: lineChart.map( date => date.recovered.total ),
        fill: false,
        backgroundColor: 'rgba(50, 255, 50, 0.6)',
        borderColor: 'rgb(0, 255, 0)',
      },
      {
        label: 'Deaths',
        data: lineChart.map( date => date.deaths.total ),
        fill: false,
        backgroundColor: 'rgba(255, 100, 100, 0.6)',
        borderColor: 'rgb(255, 100, 100)',
        },
    ],
    
    
  };

  const lineOptions = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };



if(loading){
    return (
        <div style={{ fontSize:60, textAlign: "center" }}>Loading ...</div>
    );
}



  return (
    <div>

    { countryName 

      ? <FormControl className={classesCountry.formControl}>
        <InputLabel htmlFor="age-native-simple">Area</InputLabel>
        <Select
          native
          value={state}
          onChange={ (e) => setState(e.target.value) }
          
        >
          <option aria-label="None" value="" />
          <option value="Global">Global</option>
          
          {countryName.map( (key, i) => <option key={i} value={key.name}>{key.name}</option> )}

        </Select>
      </FormControl>
      : null}
      


        {/*  Grid */}
      <div className={classesGrid.root}>
      
      <Grid container spacing={3}>
        
        <Grid item xs={12} sm={6} md={4}>
          <Paper className={classesGrid.paper}>
            
            <div className={classesGlobal.root}>
        
              <Paper elevation={3} >
                  <div className={classesTypo.root}>
                      <Typography variant="h4" gutterBottom style={{color: "goldenRod"}} >
                          {getData.confirmed.value}
                      </Typography>
                      <Typography variant="subtitle2" gutterBottom style={{color: "goldenRod", fontWeight: "bold"}} >
                          Active Cases
                      </Typography>
                  </div>
              </Paper>
              <Paper elevation={3} >
                  <div className={classesTypo.root}>
                      <Typography variant="h4" gutterBottom style={{color: "green"}} >
                          { getData.recovered.value }
                      </Typography>
                      <Typography variant="subtitle2" gutterBottom style={{color: "green", fontWeight: "bold"}} >
                          Recovered Cases
                      </Typography>
                  </div>
              </Paper>
              <Paper elevation={3} >
                  <div className={classesTypo.root}>
                      <Typography variant="h4" gutterBottom style={{color: "red"}} >
                          { getData.deaths.value }
                      </Typography>
                      <Typography variant="subtitle2" gutterBottom style={{color: "red", fontWeight: "bold"}} >
                          Deaths
                      </Typography>
                  </div>
              </Paper>
            
            </div>

          </Paper>
        </Grid>

        
            <Grid item xs={12} sm={6} md={8}>
            <Paper className={classesGrid.paper}>

              {
                state === "Global" ? <Line data={lineData} options={lineOptions} />
                : <Bar data={
                  {
                    labels: ['Active', 'Recovered', 'Red'],
                    datasets: [
                      {
                        label: 'Humans',
                        data: [getData.confirmed.value, getData.recovered.value, getData.deaths.value],
                        backgroundColor: [
                          'rgba(218, 165, 32, 0.6)',
                          'rgba(50, 255, 50, 0.6)',
                          'rgba(255, 100, 100, 0.6)',
                        ],
                        borderColor: [
                          'rgb(218, 165, 32)',
                          'rgb(0, 255, 0)',
                          'rgb(255, 100, 100)',
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }
                } options={
                  {
                    // indexAxis: 'y',
                    elements: {
                      bar: {
                        borderWidth: 2,
                      },
                    },
                    responsive: true,
                    plugins: {
                      legend: {
                        display: false
                      },
                      title: {
                        display: true,
                        text: `${state}'s Cases `,
                      },
                    },
                  }
                } />
              }

              
            </Paper>
            </Grid>
            
      </Grid>
    </div>


    </div>
  );
}