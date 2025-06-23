import React, { createContext, useState, useContext, ReactNode } from 'react';

export type DatabaseEngine = 'MySQL' | 'PostgreSQL' | 'SQL Server' | 'MongoDB' | 'Redis' | 'MariaDB';
export type DatabaseStatus = 'Running' | 'Stopped' | 'Failed' | 'Creating' | 'Updating' | 'Backup in progress';
export type DatabaseTier = 'Basic' | 'Standard' | 'Premium' | 'General Purpose' | 'Business Critical';

export type Database = {
  id: string;
  name: string;
  status: DatabaseStatus;
  engine: DatabaseEngine;
  version: string;
  tier: DatabaseTier;
  resourceGroup: string;
  location: string;
  subscription: string;
  endpoint: string;
  port: number;
  storage: number; // in GB
  computeSize: string;
  created: string;
  lastBackup?: string;
  connectionString: string;
};

interface DatabaseContextType {
  databases: Database[];
  addDatabase: (database: Omit<Database, 'id' | 'created' | 'status' | 'endpoint' | 'connectionString'>) => void;
  deleteDatabase: (id: string) => void;
  updateDatabaseStatus: (id: string, status: DatabaseStatus) => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

const mockDatabases: Database[] = [
  {
    id: 'db-1',
    name: 'prod-mysql-db',
    status: 'Running',
    engine: 'MySQL',
    version: '8.0',
    tier: 'Standard',
    resourceGroup: 'production-group',
    location: 'West Europe',
    subscription: 'Enterprise Dev/Test',
    endpoint: 'prod-mysql-db.mysql.database.azure.com',
    port: 3306,
    storage: 100,
    computeSize: 'Standard_B2s',
    created: '2023-04-15T10:30:00.000Z',
    lastBackup: '2023-12-15T02:00:00.000Z',
    connectionString: 'Server=prod-mysql-db.mysql.database.azure.com;Database=mydb;Uid=admin;Pwd=***;'
  },
  {
    id: 'db-2',
    name: 'dev-postgres-db',
    status: 'Stopped',
    engine: 'PostgreSQL',
    version: '15.0',
    tier: 'Basic',
    resourceGroup: 'development-group',
    location: 'East US',
    subscription: 'Enterprise Dev/Test',
    endpoint: 'dev-postgres-db.postgres.database.azure.com',
    port: 5432,
    storage: 50,
    computeSize: 'Standard_B1ms',
    created: '2023-05-20T14:45:00.000Z',
    lastBackup: '2023-12-14T02:00:00.000Z',
    connectionString: 'Host=dev-postgres-db.postgres.database.azure.com;Database=mydb;Username=admin;Password=***;'
  },
  {
    id: 'db-3',
    name: 'cache-redis-db',
    status: 'Running',
    engine: 'Redis',
    version: '7.0',
    tier: 'Premium',
    resourceGroup: 'production-group',
    location: 'North Europe',
    subscription: 'Enterprise Dev/Test',
    endpoint: 'cache-redis-db.redis.cache.windows.net',
    port: 6380,
    storage: 26,
    computeSize: 'Premium P1',
    created: '2023-06-10T09:15:00.000Z',
    connectionString: 'cache-redis-db.redis.cache.windows.net:6380,password=***,ssl=True,abortConnect=False'
  },
  {
    id: 'db-4',
    name: 'analytics-mongodb',
    status: 'Creating',
    engine: 'MongoDB',
    version: '6.0',
    tier: 'General Purpose',
    resourceGroup: 'analytics-group',
    location: 'West US',
    subscription: 'Enterprise Dev/Test',
    endpoint: 'analytics-mongodb.mongo.cosmos.azure.com',
    port: 10255,
    storage: 500,
    computeSize: 'Standard_M30',
    created: '2023-12-15T08:30:00.000Z',
    connectionString: 'mongodb://analytics-mongodb:***@analytics-mongodb.mongo.cosmos.azure.com:10255/?ssl=true'
  }
];

export const DatabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [databases, setDatabases] = useState<Database[]>(mockDatabases);

  const addDatabase = (newDatabase: Omit<Database, 'id' | 'created' | 'status' | 'endpoint' | 'connectionString'>) => {
    const database: Database = {
      ...newDatabase,
      id: `db-${Date.now()}`,
      created: new Date().toISOString(),
      status: 'Creating',
      endpoint: `${newDatabase.name}.${newDatabase.engine.toLowerCase()}.database.azure.com`,
      connectionString: generateConnectionString(newDatabase.engine, newDatabase.name),
    };
    
    setDatabases([...databases, database]);
    
    // Simulate database creation completion after 5 seconds
    setTimeout(() => {
      setDatabases(prevDatabases => 
        prevDatabases.map(db => 
          db.id === database.id ? { ...db, status: 'Running' } : db
        )
      );
    }, 5000);
  };

  const deleteDatabase = (id: string) => {
    setDatabases(databases.filter(db => db.id !== id));
  };

  const updateDatabaseStatus = (id: string, status: DatabaseStatus) => {
    setDatabases(databases.map(db => (db.id === id ? { ...db, status } : db)));
  };

  return (
    <DatabaseContext.Provider value={{ databases, addDatabase, deleteDatabase, updateDatabaseStatus }}>
      {children}
    </DatabaseContext.Provider>
  );
};

const generateConnectionString = (engine: DatabaseEngine, name: string): string => {
  switch (engine) {
    case 'MySQL':
    case 'MariaDB':
      return `Server=${name}.mysql.database.azure.com;Database=mydb;Uid=admin;Pwd=***;`;
    case 'PostgreSQL':
      return `Host=${name}.postgres.database.azure.com;Database=mydb;Username=admin;Password=***;`;
    case 'SQL Server':
      return `Server=${name}.database.windows.net;Database=mydb;User Id=admin;Password=***;`;
    case 'MongoDB':
      return `mongodb://${name}:***@${name}.mongo.cosmos.azure.com:10255/?ssl=true`;
    case 'Redis':
      return `${name}.redis.cache.windows.net:6380,password=***,ssl=True,abortConnect=False`;
    default:
      return `Connection string for ${name}`;
  }
};

export const useDatabaseContext = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabaseContext must be used within a DatabaseProvider');
  }
  return context;
};