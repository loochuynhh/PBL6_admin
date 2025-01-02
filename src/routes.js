import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdStar,
  MdTableChart,
} from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import Profile from 'views/admin/profile';
import DataTables from 'views/admin/dataTables';

// Auth Imports
import ExerciseTable from 'views/admin/exercise';

const routes = [
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: '/default',
    component: <MainDashboard />,
  },
  {
    name: 'Plan Table',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit"/>,
    path: '/plan-tables',
    component: <DataTables type='plan' />,
  },
  {
    name: 'Exercise Table',
    layout: '/admin',
    icon: <Icon as={MdTableChart} width="20px" height="20px" color="inherit"/>,
    path: '/exercise-tables',
    component: <ExerciseTable />,
  },
  {
    name: 'Account',
    layout: '/admin',
    path: '/account',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit"/>,
    component: <Profile />,
  },
  {
    name: 'Approve Plan',
    layout: '/admin',
    path: '/approve-plan',
    icon: <Icon as={MdStar} width="20px" height="20px" color="inherit"/>,
    component: <DataTables type='approve' />,
  }
];

export default routes;
