import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Tabs,
  Tab,
  Paper,
  Divider
} from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import DatePickerTest from './DatePickerTest';
import ManualTimeEntry from './ManualTimeEntry';
import AutomaticTimer from './AutomaticTimer';
import TimeCategories from './TimeCategories';
import TimeRoundingSettings from './TimeRoundingSettings';

const Timer = ({ clients = [], matters = [] }) => {
  const [tabValue, setTabValue] = useState('automatic');
  const [practiceAreas, setPracticeAreas] = useState([
    { id: 1, name: 'Contract Review' },
    { id: 2, name: 'Litigation' },
    { id: 3, name: 'Corporate Law' },
    { id: 4, name: 'Intellectual Property' },
    { id: 5, name: 'Real Estate' }
  ]);
  const [activityTypes, setActivityTypes] = useState([
    { id: 1, name: 'Research' },
    { id: 2, name: 'Client Call' },
    { id: 3, name: 'Document Drafting' },
    { id: 4, name: 'Court Appearance' },
    { id: 5, name: 'Meeting' }
  ]);
  const [globalRoundingIncrement, setGlobalRoundingIncrement] = useState(0.1);
  const [roundingMethod, setRoundingMethod] = useState('nearest');
  const [matterSpecificRounding, setMatterSpecificRounding] = useState(false);
  const [matterRoundingRules, setMatterRoundingRules] = useState([]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Paper sx={{ mb: 3, overflow: 'hidden' }}>
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              aria-label="time tracking tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Automatic Timer" value="automatic" />
              <Tab label="Manual Entry" value="manual" />
              <Tab label="Categories" value="categories" />
              <Tab label="Time Rounding" value="rounding" />
            </Tabs>
          </Box>
          
          <TabPanel value="automatic" sx={{ p: 3 }}>
            <AutomaticTimer 
              clients={clients} 
              matters={matters} 
              practiceAreas={practiceAreas}
              activityTypes={activityTypes}
              roundingIncrement={globalRoundingIncrement}
            />
          </TabPanel>
          
          <TabPanel value="manual" sx={{ p: 3 }}>
            <ManualTimeEntry 
              clients={clients} 
              matters={matters} 
              practiceAreas={practiceAreas}
              activityTypes={activityTypes}
            />
          </TabPanel>
          
          <TabPanel value="categories" sx={{ p: 3 }}>
            <TimeCategories 
              practiceAreas={practiceAreas}
              setPracticeAreas={setPracticeAreas}
              activityTypes={activityTypes}
              setActivityTypes={setActivityTypes}
            />
          </TabPanel>
          
          <TabPanel value="rounding" sx={{ p: 3 }}>
            <TimeRoundingSettings 
              globalRoundingIncrement={globalRoundingIncrement}
              setGlobalRoundingIncrement={setGlobalRoundingIncrement}
              roundingMethod={roundingMethod}
              setRoundingMethod={setRoundingMethod}
              matterSpecificRounding={matterSpecificRounding}
              setMatterSpecificRounding={setMatterSpecificRounding}
              matterRoundingRules={matterRoundingRules}
              setMatterRoundingRules={setMatterRoundingRules}
              matters={matters}
            />
          </TabPanel>
        </TabContext>
      </Paper>
    </Box>
  );
};

export default Timer; 