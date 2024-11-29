import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { getDatabase } from '../database/Database';

const CreateUser = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const createUser = () => {
    const db = getDatabase();

    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
        [email, password, 'user'],
        () => {
          alert('Usuário criado com sucesso!');
          navigation.goBack();
        },
        error => console.error('Erro ao criar usuário:', error),
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Novo Usuário</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={createUser}>
        <Text style={styles.buttonText}>Criar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EFDFCC',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#BA8E7A',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '90%',
    borderColor: '#D4C2AD',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#BA8E7A',
  },
  button: {
    backgroundColor: '#BA8E7A',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '90%',
  },
  buttonText: {
    color: '#EFDFCC',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateUser;
