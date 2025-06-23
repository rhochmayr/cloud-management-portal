import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Overview from './pages/Overview';
import Dashboard from './pages/Dashboard';
import CreateVM from './pages/CreateVM';
import VMDetails from './pages/VMDetails';
import Databases from './pages/Databases';
import DatabaseDetails from './pages/DatabaseDetails';
import CreateDatabase from './pages/CreateDatabase';
import Storage from './pages/Storage';
import CreateStorage from './pages/CreateStorage';
import Networking from './pages/Networking';
import CreateNetworking from './pages/CreateNetworking';
import Security from './pages/Security';
import Monitoring from './pages/Monitoring';
import { VMProvider } from './context/VMContext';
import { DatabaseProvider } from './context/DatabaseContext';
import { StorageProvider } from './context/StorageContext';
import { NetworkingProvider } from './context/NetworkingContext';
import { SecurityProvider } from './context/SecurityContext';
import { MonitoringProvider } from './context/MonitoringContext';
import { SettingsProvider } from './context/SettingsContext';
import { BillingProvider } from './context/BillingContext';
import Settings from './pages/Settings';
import Billing from './pages/Billing';
import './styles/globals.css';

function App() {
  return (
    <VMProvider>
      <DatabaseProvider>
        <StorageProvider>
          <NetworkingProvider>
            <SecurityProvider>
              <MonitoringProvider>
                <SettingsProvider>
                  <BillingProvider>
                    <Router>
                      <Routes>
                        <Route path="/" element={<Layout />}>
                          <Route index element={<Overview />} />
                          <Route path="/vms" element={<Dashboard />} />
                          <Route path="/create-vm" element={<CreateVM />} />
                          <Route path="/vm/:id" element={<VMDetails />} />
                          <Route path="/databases" element={<Databases />} />
                          <Route path="/database/:id" element={<DatabaseDetails />} />
                          <Route path="/create-database" element={<CreateDatabase />} />
                          <Route path="/storage" element={<Storage />} />
                          <Route path="/create-storage" element={<CreateStorage />} />
                          <Route path="/networking" element={<Networking />} />
                          <Route path="/create-networking" element={<CreateNetworking />} />
                          <Route path="/security" element={<Security />} />
                          <Route path="/monitoring" element={<Monitoring />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="/billing" element={<Billing />} />
                        </Route>
                      </Routes>
                    </Router>
                  </BillingProvider>
                </SettingsProvider>
              </MonitoringProvider>
            </SecurityProvider>
          </NetworkingProvider>
        </StorageProvider>
      </DatabaseProvider>
    </VMProvider>
  );
}

export default App;