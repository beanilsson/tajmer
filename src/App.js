import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import moment from 'moment';
import axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    const [projectName, setProjectName] = useState('');
    const [start, setStart] = useState('');
    const [stop, setStop] = useState('');
    const [startWasPressed, setStartWasPressed] = useState(false);
    const [stopWasPressed, setStopWasPressed] = useState(false);
    const [timeSpent, setTimeSpent] = useState(null);
    const [serverMessage, setServerMessage] = useState('');

    useEffect(() => {
        const getServerMessage = async () => {
            const result = await axios.get(`http://localhost:3001/`);
            setServerMessage(result.data);
        };

        getServerMessage();
    }, []);

    const handleChange = event => {
        if (start && stop) {
            clear();
        }
        setProjectName(event.target.value);
    };

    const startWorking = () => {
        if (!startWasPressed) {
            setStartWasPressed(true);
            setStopWasPressed(false);
            setStart(moment());
            setStop('');
            setTimeSpent(null);
        }
    };

    const stoppedWorking = () => {
        if (!stopWasPressed) {
            setStartWasPressed(false);
            setStopWasPressed(true);
            const stopDate = moment();
            setStop(stopDate);
            setTimeSpent(stopDate.diff(start, 'minutes'));
        }
    };

    const StartedMessage = () => {
        if (start !== '') {
            return <div>Arbetet med {projectName} började: {start.format("HH:mm")}</div>;
        } else {
            return <></>;
        }
    };

    const StoppedMessage = () => {
        if (stop !== '') {
            return <div>Arbetet med {projectName} slutade: {stop.format("HH:mm")}</div>;
        } else {
            return <></>;
        }
    };

    const TimeSpentMessage = () => {
        if (timeSpent !== null) {
            if (timeSpent >= 0 && timeSpent < 60) {
                return <Alert key={123} variant={'dark'}>Tid spenderad på {projectName}: {timeSpent} minuter</Alert>;
            } else if (timeSpent >= 60) {
                return <Alert key={123} variant={'dark'}>Tid spenderad på {projectName}: {timeSpent / 60} timmar</Alert>;
            }
        } else {
            return <></>;
        }
    };

    const clear = () => {
        setStart('');
        setStop('');
        setTimeSpent(null);
        setProjectName('');
    };

    const ServerMessage = () => {
        return <Alert key={456} variant={'info'}>Servern säger {serverMessage}</Alert>;
    };

    return (
        <div className="App">
          <ServerMessage/>
          <form>
            <label>
              Ange projektnamn: <br />
              <input type="text" name="projectName" value={projectName} onChange={handleChange} />
            </label>
          </form>
          <div className="flex-parent">
            <div className="flex-sub"><Button variant="outline-success" onClick={startWorking}>Starta</Button></div>
            <div className="flex-sub"><Button variant="outline-danger" onClick={stoppedWorking}>Sluta</Button></div>
            <div className="flex-sub"><Button variant="outline-warning" onClick={clear}>Rensa</Button></div>
          </div>
          <StartedMessage />
          <StoppedMessage />
          <TimeSpentMessage />
        </div>
    );
};

export default App;
