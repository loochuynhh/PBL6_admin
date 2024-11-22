import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
} from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import NFTMarketplace from 'views/admin/marketplace';
import Profile from 'views/admin/profile';
import DataTables from 'views/admin/dataTables';
import RTL from 'views/admin/rtl';

// Auth Imports
import SignInCentered from 'views/auth/signIn';
import ExerciseTable from 'views/admin/exercise';

const routes = [
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: '/default',
    component: <MainDashboard />,
  },
  {
    name: 'NFT Marketplace',
    layout: '/admin',
    path: '/nft-marketplace',
    icon: (
      <Icon
        as={MdOutlineShoppingCart}
        width="20px"
        height="20px"
        color="inherit"
        mb='1rem'
      />
    ),
    component: <NFTMarketplace />,
    secondary: true,
  },
  {
    name: 'Plan Table',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" mb='1rem'/>,
    path: '/plan-tables',
    component: <DataTables />,
  },
  {
    name: 'Exercise Table',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" mb='1rem'/>,
    path: '/exercise-tables',
    component: <ExerciseTable />,
  },
  {
    name: 'Profile',
    layout: '/admin',
    path: '/profile',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" mb='1rem'/>,
    component: <Profile />,
  },
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" mb='1rem'/>,
    component: <SignInCentered />,
  },
  {
    name: 'RTL Admin',
    layout: '/rtl',
    path: '/rtl-default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" mb='1rem'/>,
    component: <RTL />,
  },
];

export default routes;
