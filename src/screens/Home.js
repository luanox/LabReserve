import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getDatabase, resetTables } from '../database/Database';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({ navigation }) => {
  const [nearestReservation, setNearestReservation] = useState(null);

  useFocusEffect(
    useCallback(() => {
      checkUserRole();
      fetchNearestReservation();
    }, []),
  );

  const [isAdmin, setIsAdmin] = useState(false);

  const handleResetDatabase = () => {
    Alert.alert(
      'Confirmação',
      'Você tem certeza que deseja resetar o banco de dados? Todos os dados serão perdidos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            resetTables();
            alert('Banco de dados resetado com sucesso!');
          },
        },
      ],
    );
  };

  const checkUserRole = async () => {
    const userEmail = await AsyncStorage.getItem('userEmail');
    if (userEmail === 'admin@email.com') {
      setIsAdmin(true);
    }
  };

  const fetchNearestReservation = () => {
    const db = getDatabase();
    const currentDateTime = new Date().toISOString(); // Data e hora atuais no formato ISO

    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM reservations 
         WHERE datetime(date || ' ' || time) >= datetime(?) 
         ORDER BY datetime(date || ' ' || time) ASC 
         LIMIT 1;`,
        [currentDateTime],
        (_, result) => {
          if (result.rows.length > 0) {
            setNearestReservation(result.rows.item(0));
          } else {
            setNearestReservation(null); // Sem reservas futuras
          }
        },
        error => {
          console.error('Erro ao buscar reserva mais próxima:', error);
        },
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao LabReserve</Text>

      {/* Exibe a reserva mais próxima */}
      {nearestReservation ? (
        <View style={styles.reservationBox}>
          <Text style={styles.label}>Próxima Reserva:</Text>
          <Text style={styles.reservationText}>
            {nearestReservation.lab_name}
          </Text>
          <Text style={styles.reservationText}>
            Data: {new Date(nearestReservation.date).toLocaleDateString()}
          </Text>
          <Text style={styles.reservationText}>
            Hora: {nearestReservation.time}
          </Text>
        </View>
      ) : (
        <Text style={styles.noReservationText}>Nenhuma reserva futura encontrada.</Text>
      )}

      {isAdmin && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('CreateUser')}
        >
          <Text style={styles.buttonText}>Criar Novo Usuário</Text>
        </TouchableOpacity>
      )}
      {/* Botões de Navegação */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('LabSelection')}
      >
        <Text style={styles.buttonText}>Reservar Laboratório</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('MyReservations')}
      >
        <Text style={styles.buttonText}>Todas as Reservas</Text>
      </TouchableOpacity>

      {isAdmin && (
        <TouchableOpacity style={styles.button} onPress={handleResetDatabase}>
          <Text style={styles.buttonText}>Resetar Banco de Dados</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Sair</Text>
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
  reservationBox: {
    backgroundColor: '#D4C2AD',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 16,
    color: '#BA8E7A',
    fontWeight: '600',
    marginBottom: 10,
    marginStart: 70,
  },
  reservationText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  noReservationText: {
    fontSize: 16,
    color: '#BA8E7A',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#BA8E7A',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#EFDFCC',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Home;
