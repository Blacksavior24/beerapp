import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';

interface Registro {
  id: string;
  dni: string;
  nombres: string;
  cantidad: number;
  tipo: 'Cerveza' | 'Agua';
  descripcion: string;
  lugar: 'Casa' | 'Afuera';
  fecha: string;
}

// Simulamos los registros guardados (en una app real vendría de Context/Redux/Convex)
const registrosGuardados: Registro[] = [
  {
    id: '1',
    dni: '12345678',
    nombres: 'Juan Pérez',
    cantidad: 2,
    tipo: 'Cerveza',
    descripcion: 'Para la cena de esta noche',
    lugar: 'Casa',
    fecha: '2024-01-15 18:30'
  },
  {
    id: '2',
    dni: '87654321',
    nombres: 'María González',
    cantidad: 1,
    tipo: 'Agua',
    descripcion: 'Agua mineral para el gimnasio',
    lugar: 'Afuera',
    fecha: '2024-01-15 17:45'
  },
  {
    id: '3',
    dni: '11223344',
    nombres: 'Carlos Rodríguez',
    cantidad: 6,
    tipo: 'Cerveza',
    descripcion: 'Reunión con amigos del trabajo',
    lugar: 'Casa',
    fecha: '2024-01-15 16:20'
  }
];

export default function RegistrosScreen() {
  const navigation = useNavigation();

  const handleEliminar = (id: string, nombres: string) => {
    Alert.alert(
      'Eliminar Registro',
      `¿Estás seguro de eliminar el registro de ${nombres}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            // Aquí eliminarías el registro
            Alert.alert('Eliminado', 'Registro eliminado exitosamente');
          }
        }
      ]
    );
  };

  const renderRegistro = ({ item }: { item: Registro }) => (
    <View style={styles.registroCard}>
      <View style={styles.registroHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.nombres}>{item.nombres}</Text>
          <Text style={styles.dni}>DNI: {item.dni}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleEliminar(item.id, item.nombres)}
        >
          <Ionicons name="trash-outline" size={20} color="#FF4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.registroBody}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Tipo:</Text>
            <View style={[styles.badge, item.tipo === 'Cerveza' ? styles.cervezaBadge : styles.aguaBadge]}>
              <Text style={[styles.badgeText, item.tipo === 'Cerveza' ? styles.cervezaText : styles.aguaText]}>
                {item.tipo}
              </Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.label}>Cantidad:</Text>
            <Text style={styles.cantidad}>{item.cantidad}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.label}>Lugar:</Text>
            <View style={[styles.badge, item.lugar === 'Casa' ? styles.casaBadge : styles.afueraBadge]}>
              <Text style={[styles.badgeText, item.lugar === 'Casa' ? styles.casaText : styles.afueraText]}>
                {item.lugar}
              </Text>
            </View>
          </View>
        </View>

        {item.descripcion ? (
          <View style={styles.descripcionContainer}>
            <Text style={styles.label}>Descripción:</Text>
            <Text style={styles.descripcion}>{item.descripcion}</Text>
          </View>
        ) : null}

        <Text style={styles.fecha}>{item.fecha}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Registros Guardados</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          Total de registros: {registrosGuardados.length}
        </Text>
      </View>

      <FlatList
        data={registrosGuardados}
        renderItem={renderRegistro}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-outline" size={64} color="#CCCCCC" />
            <Text style={styles.emptyTitle}>No hay registros</Text>
            <Text style={styles.emptySubtitle}>
              Los registros que guardes aparecerán aquí
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('Home' as never)}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 34,
  },
  statsContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  statsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  registroCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  registroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  nombres: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  dni: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFF5F5',
  },
  registroBody: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
    marginBottom: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cervezaBadge: {
    backgroundColor: '#FFF3CD',
  },
  cervezaText: {
    color: '#856404',
  },
  aguaBadge: {
    backgroundColor: '#D1ECF1',
  },
  aguaText: {
    color: '#0C5460',
  },
  casaBadge: {
    backgroundColor: '#D4EDDA',
  },
  casaText: {
    color: '#155724',
  },
  afueraBadge: {
    backgroundColor: '#F8D7DA',
  },
  afueraText: {
    color: '#721C24',
  },
  cantidad: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },
  descripcionContainer: {
    marginTop: 4,
  },
  descripcion: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  fecha: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 60,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});