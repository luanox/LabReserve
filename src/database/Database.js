import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'labreserve.db',
    location: 'default',
  },
  () => console.log('Database connected'),
  error => console.log('Database error:', error),
);

SQLite.DEBUG(true); // Ativa logs para depuração
SQLite.enablePromise(true);

export const initDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS reservations (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         professor_email TEXT,
         lab_name TEXT,
         date TEXT,
         time TEXT
       );`,
      [],
      () => console.log('Table created'),
      error => console.log('Error creating table:', error),
    );

        // Tabela de usuários
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         email TEXT NOT NULL UNIQUE,
         password TEXT NOT NULL,
         role TEXT NOT NULL
       );`,
    );

    // Inserir o administrador padrão (se não existir)
    tx.executeSql(
      'INSERT OR IGNORE INTO users (email, password, role) VALUES (?, ?, ?)',
      ['admin@email.com', '123', 'admin'],
    );
  });
};

export const resetTables = () => {
  db.transaction(tx => {
    // Apaga as tabelas
    tx.executeSql('DROP TABLE IF EXISTS reservations;');
    tx.executeSql('DROP TABLE IF EXISTS users;');

    // Recria as tabelas
    initDatabase();
    console.log('Tabelas resetadas e recriadas.');
  });
};

export const getDatabase = () => db;
