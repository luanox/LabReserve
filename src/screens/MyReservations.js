import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ClipboardDocumentListIcon } from 'react-native-heroicons/outline'; // Ícone para exibição
import { getDatabase } from '../database/Database';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchReservations();
    }, []),
  );

  const fetchReservations = () => {
    const db = getDatabase();

    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM reservations ORDER BY date ASC, time ASC', // Ordena por data e hora
        [],
        (_, { rows }) => {
          const data = [];
          for (let i = 0; i < rows.length; i++) {
            data.push(rows.item(i));
          }
          setReservations(data);
        },
        error => {
          console.error('Erro ao buscar reservas:', error);
        }
      );
    });
  };

  const renderReservation = ({ item }) => (
    <View style={styles.reservationItem}>
      <View style={styles.reservationDetails}>
        <Text style={styles.labName}>Laboratório: {item.lab_name}</Text>
        <Text style={styles.reservationText}>Data: {new Date(item.date).toLocaleDateString()}</Text>
        <Text style={styles.reservationText}>Hora: {item.time}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Reservas</Text>

      {reservations.length > 0 ? (
        <FlatList
          data={reservations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderReservation}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <ClipboardDocumentListIcon color="#BA8E7A" size={60} />
          <Text style={styles.emptyText}>Nenhuma reserva encontrada.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFDFCC',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#BA8E7A',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  reservationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#BA8E7A',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  reservationIcon: {
    marginRight: 10,
  },
  reservationDetails: {
    flex: 1,
  },
  labName: {
    fontSize: 16,
    color: '#EFDFCC',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  reservationText: {
    fontSize: 14,
    color: '#EFDFCC',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 20,
    fontSize: 16,
    color: '#BA8E7A',
    textAlign: 'center',
  },
});

export default MyReservations;
