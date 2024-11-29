import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CalendarDaysIcon, ClockIcon, AcademicCapIcon } from 'react-native-heroicons/outline'; // Ícones da biblioteca
import { getDatabase } from '../database/Database';

const labs = [
  'Laboratório de Informática',
  'Laboratório de Anatomia',
  'Laboratório de Ensino de Matemática e Física',
  'Laboratório de Geografia, Geotecnologias e Dinâmicas da Natureza',
  'Laboratório de Práticas Pedagógicas',
];

const LabSelection = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onChange = (event, selectedValue) => {
    setShowDatePicker(false);
    setShowTimePicker(false);
    if (selectedValue) {
      setSelectedDate(selectedValue);
    }
  };

  const reserveLab = (lab) => {
    const db = getDatabase();
    const date = selectedDate.toISOString().split('T')[0];
    const time = selectedDate.toLocaleTimeString();

    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO reservations (professor_email, lab_name, date, time) VALUES (?, ?, ?, ?)',
        ['professor@email.com', lab, date, time],
        () => {
          alert(`Laboratório "${lab}" reservado para ${date} às ${time}.`);
          navigation.navigate('MyReservations');
        },
        error => console.error('Erro ao reservar laboratório:', error),
      );
    });
  };

  return (
    <View style={styles.container}>
      {/* Exibe a data e hora selecionada */}
      <View style={styles.dateTimeContainer}>
        <Text style={styles.label}>Data Selecionada:</Text>
        <Text style={styles.dateText}>{selectedDate.toLocaleDateString()}</Text>
        <Text style={styles.label}>Hora Selecionada:</Text>
        <Text style={styles.timeText}>{selectedDate.toLocaleTimeString()}</Text>
      </View>

      {/* Botão para selecionar data */}
      <TouchableOpacity style={styles.iconButton} onPress={() => setShowDatePicker(true)}>
        <CalendarDaysIcon color="#EFDFCC" size={24} />
        <Text style={styles.buttonText}>Selecionar Data</Text>
      </TouchableOpacity>

      {/* Botão para selecionar hora */}
      <TouchableOpacity style={styles.iconButton} onPress={() => setShowTimePicker(true)}>
        <ClockIcon color="#EFDFCC" size={24} />
        <Text style={styles.buttonText}>Selecionar Hora</Text>
      </TouchableOpacity>

      {/* DateTimePicker para Data */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}

      {/* DateTimePicker para Hora */}
      {showTimePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="time"
          display="default"
          onChange={onChange}
        />
      )}

      {/* Lista de Laboratórios */}
      <FlatList
        data={labs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => reserveLab(item)}
            style={styles.labItem}
          >
            <AcademicCapIcon color="#EFDFCC" size={24} style={styles.labIcon} />
            <Text style={styles.labText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D4C2AD',
    padding: 20,
  },
  dateTimeContainer: {
    marginBottom: 20,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#EFDFCC',
    borderRadius: 10,
  },
  label: {
    fontSize: 14,
    color: '#BA8E7A',
    fontWeight: '600',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 18,
    color: '#BA8E7A',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timeText: {
    fontSize: 18,
    color: '#BA8E7A',
    fontWeight: 'bold',
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#EFDFCC',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  labItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#BA8E7A',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  labIcon: {
    marginRight: 10,
  },
  labText: {
    color: '#EFDFCC',
    fontSize: 16,
  },
});

export default LabSelection;
