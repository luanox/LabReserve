import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { EnvelopeIcon, LockClosedIcon, AcademicCapIcon } from 'react-native-heroicons/outline'; // Ícones Heroicons
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from '../database/Database';


const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const authenticate = async () => {
    const db = getDatabase();

    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password],
        (_, result) => {
          if (result.rows.length > 0) {
            // Armazenar o e-mail do usuário logado
            AsyncStorage.setItem('userEmail', email);
            navigation.navigate('Home');
          } else {
            alert('E-mail ou senha inválidos!');
          }
        },
        error => {
          console.error('Erro ao autenticar usuário:', error);
        }
      );
    });
  };

  return (
    <View style={styles.container}>
      {/* Logo do Aplicativo */}
      <View style={styles.logoContainer}>
        <AcademicCapIcon size={60} color="#BA8E7A" />
        <Text style={styles.title}>LabReserve</Text>
      </View>

      {/* Campo de E-mail */}
      <View style={styles.inputContainer}>
        <EnvelopeIcon size={20} color="#BA8E7A" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Campo de Senha */}
      <View style={styles.inputContainer}>
        <LockClosedIcon size={20} color="#BA8E7A" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Botão Entrar */}
      <TouchableOpacity style={styles.button} onPress={authenticate}>
        <Text style={styles.buttonText}>Entrar</Text>
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    color: '#BA8E7A',
    fontWeight: 'bold',
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#D4C2AD',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    width: '90%',
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#BA8E7A',
  },
  button: {
    backgroundColor: '#BA8E7A',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '90%',
    marginTop: 10,
  },
  buttonText: {
    color: '#EFDFCC',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Login;
