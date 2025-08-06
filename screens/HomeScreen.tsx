import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
  StyleSheet
} from 'react-native';
import { toast } from 'sonner-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';

interface FormData {
  dni: string;
  nombres: string;
  cantidad: string;
  tipo: 'Cerveza' | 'Agua';
  descripcion: string;
  lugar: 'Casa' | 'Afuera';
}

interface FormErrors {
  dni?: string;
  nombres?: string;
  cantidad?: string;
}

export default function HomeScreen() {
    const navigation = useNavigation();
  
  const [formData, setFormData] = useState<FormData>({
    dni: '',
    nombres: '',
    cantidad: '1',
    tipo: 'Cerveza',
    descripcion: '',
    lugar: 'Casa',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registros, setRegistros] = useState<FormData[]>([]);

  // Validación en tiempo real
  const validateField = (field: keyof FormData, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'dni':
        if (!value) {
          newErrors.dni = 'DNI es obligatorio';
        } else if (!/^\d+$/.test(value)) {
          newErrors.dni = 'DNI debe contener solo números';
        } else if (value.length < 8) {
          newErrors.dni = 'DNI debe tener mínimo 8 dígitos';
        } else {
          delete newErrors.dni;
        }
        break;

      case 'nombres':
        if (!value.trim()) {
          newErrors.nombres = 'Nombres y Apellidos es obligatorio';
        } else if (value.trim().length < 3) {
          newErrors.nombres = 'Debe tener al menos 3 caracteres';
        } else {
          delete newErrors.nombres;
        }
        break;

      case 'cantidad':
        if (!value) {
          newErrors.cantidad = 'Cantidad es obligatoria';
        } else if (!/^\d+$/.test(value)) {
          newErrors.cantidad = 'Cantidad debe ser un número';
        } else if (parseInt(value) < 1) {
          newErrors.cantidad = 'Cantidad debe ser mayor a 0';
        } else if (parseInt(value) > 100) {
          newErrors.cantidad = 'Cantidad no puede ser mayor a 100';
        } else {
          delete newErrors.cantidad;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const isFormValid = () => {
    return (
      Object.keys(errors).length === 0 &&
      formData.dni.length >= 8 &&
      formData.nombres.trim().length >= 3 &&
      formData.cantidad &&
      parseInt(formData.cantidad) >= 1
    );
  };

  const handleSubmit = async () => {
    // Validar todos los campos antes de enviar
    validateField('dni', formData.dni);
    validateField('nombres', formData.nombres);
    validateField('cantidad', formData.cantidad);

    if (!isFormValid()) {
      toast.error('Por favor corrige los errores antes de continuar', {
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simular guardado con delay
      toast.loading('Guardando registro...', { duration: 1500 });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Agregar a la lista
      setRegistros(prev => [...prev, formData]);
      
      // Limpiar formulario
      setFormData({
        dni: '',
        nombres: '',
        cantidad: '1',
        tipo: 'Cerveza',
        descripcion: '',
        lugar: 'Casa',
      });
      
      setErrors({});
      
      toast.success('¡Registro guardado exitosamente!', {
        duration: 3000,
      });
      
    } catch (error) {
      toast.error('Error al guardar el registro', {
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const RadioButton = ({ 
    label, 
    selected, 
    onPress 
  }: { 
    label: string; 
    selected: boolean; 
    onPress: () => void; 
  }) => (
    <TouchableOpacity
      style={[
        styles.radioContainer,
        selected && styles.radioSelected
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.radioCircle, selected && styles.radioCircleSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <Text style={[styles.radioLabel, selected && styles.radioLabelSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

    return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
                📝 Formulario de Registro
            </Text>
            <TouchableOpacity 
                style={styles.viewRecordsButton}
                onPress={() => navigation.navigate('Registros' as never)}
            >
                <Ionicons name="list-outline" size={18} color="white" />
                <Text style={styles.viewRecordsText}>Ver</Text>
            </TouchableOpacity>
            </View>


          <View style={styles.formContainer}>
            <Text style={styles.title}>📝 Registro de Datos</Text>
            
            {/* DNI */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>   
                DNI <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  errors.dni && styles.inputError
                ]}
                value={formData.dni}
                onChangeText={(value) => handleInputChange('dni', value)}
                placeholder="Ingresa tu DNI (mín. 8 dígitos)"
                keyboardType="numeric"
                maxLength={12}
              />
              {errors.dni && <Text style={styles.errorText}>{errors.dni}</Text>}
              {formData.dni && !errors.dni && (
                <Text style={styles.successText}>✓ DNI válido</Text>
              )}
            </View>

            {/* Nombres y Apellidos */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Nombres y Apellidos <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  errors.nombres && styles.inputError
                ]}
                value={formData.nombres}
                onChangeText={(value) => handleInputChange('nombres', value)}
                placeholder="Ingresa nombres y apellidos completos"
                autoCapitalize="words"
              />
              {errors.nombres && <Text style={styles.errorText}>{errors.nombres}</Text>}
              {formData.nombres && !errors.nombres && (
                <Text style={styles.successText}>✓ Nombres válidos</Text>
              )}
            </View>

            {/* Cantidad */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Cantidad <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  errors.cantidad && styles.inputError
                ]}
                value={formData.cantidad}
                onChangeText={(value) => handleInputChange('cantidad', value)}
                placeholder="Cantidad (1-100)"
                keyboardType="numeric"
                maxLength={3}
              />
              {errors.cantidad && <Text style={styles.errorText}>{errors.cantidad}</Text>}
              {formData.cantidad && !errors.cantidad && (
                <Text style={styles.successText}>✓ Cantidad válida</Text>
              )}
            </View>

            {/* Tipo */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Tipo de Producto</Text>
              <View style={styles.radioGroup}>
                <RadioButton
                  label="🍺 Cerveza"
                  selected={formData.tipo === 'Cerveza'}
                  onPress={() => setFormData(prev => ({ ...prev, tipo: 'Cerveza' }))}
                />
                <RadioButton
                  label="💧 Agua"
                  selected={formData.tipo === 'Agua'}
                  onPress={() => setFormData(prev => ({ ...prev, tipo: 'Agua' }))}
                />
              </View>
            </View>

            {/* Lugar */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Lugar de Consumo</Text>
              <View style={styles.radioGroup}>
                <RadioButton
                  label="🏠 Casa"
                  selected={formData.lugar === 'Casa'}
                  onPress={() => setFormData(prev => ({ ...prev, lugar: 'Casa' }))}
                />
                <RadioButton
                  label="🌳 Afuera"
                  selected={formData.lugar === 'Afuera'}
                  onPress={() => setFormData(prev => ({ ...prev, lugar: 'Afuera' }))}
                />
              </View>
            </View>

            {/* Descripción */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.descripcion}
                onChangeText={(value) => setFormData(prev => ({ ...prev, descripcion: value }))}
                placeholder="Descripción adicional (opcional)"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Botón de Enviar */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                !isFormValid() && styles.submitButtonDisabled,
                isSubmitting && styles.submitButtonLoading
              ]}
              onPress={handleSubmit}
              disabled={!isFormValid() || isSubmitting}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.submitButtonText,
                !isFormValid() && styles.submitButtonTextDisabled
              ]}>
                {isSubmitting ? '⏳ Guardando...' : '💾 Guardar Registro'}
              </Text>
            </TouchableOpacity>

            {/* Indicador de estado del formulario */}
            <View style={styles.statusContainer}>
              <Text style={[
                styles.statusText,
                isFormValid() ? styles.statusValid : styles.statusInvalid
              ]}>
                {isFormValid() ? '✅ Formulario completo' : '⚠️ Completa los campos requeridos'}
              </Text>
            </View>
          </View>

          {/* Lista de registros */}
          {registros.length > 0 && (
            <View style={styles.registrosContainer}>
              <Text style={styles.registrosTitle}>📋 Registros Guardados ({registros.length})</Text>
              {registros.map((registro, index) => (
                <View key={index} style={styles.registroCard}>
                  <Text style={styles.registroText}>
                    <Text style={styles.registroLabel}>DNI:</Text> {registro.dni}
                  </Text>
                  <Text style={styles.registroText}>
                    <Text style={styles.registroLabel}>Nombre:</Text> {registro.nombres}
                  </Text>
                  <Text style={styles.registroText}>
                    <Text style={styles.registroLabel}>Cantidad:</Text> {registro.cantidad}
                  </Text>
                  <Text style={styles.registroText}>
                    <Text style={styles.registroLabel}>Tipo:</Text> {registro.tipo}
                  </Text>
                  <Text style={styles.registroText}>
                    <Text style={styles.registroLabel}>Lugar:</Text> {registro.lugar}
                  </Text>
                  {registro.descripcion && (
                    <Text style={styles.registroText}>
                      <Text style={styles.registroLabel}>Descripción:</Text> {registro.descripcion}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles =  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
  flexDirection: 'row',
  alignItems: 'flex-start', // Alinea arriba para que paddingTop funcione visualmente
  paddingTop: 40, // Espacio desde la parte superior del header
  paddingBottom: 12,
  paddingHorizontal: 12,
  backgroundColor: '#3498db',
  width: '100%',
},

headerTitle: {
  flex: 1,
  fontSize: 18,
  fontWeight: 'bold',
  color: 'white',
  marginTop: 2, // Ajuste fino
  marginRight: 8,
  maxWidth: '70%',
},

viewRecordsButton: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 12,
  paddingVertical: 6,
  backgroundColor: 'rgba(255, 255, 255, 0.25)',
  borderRadius: 20,
  flexShrink: 0,
  marginTop: 2, // Igual altura visual que el título
},

viewRecordsText: {
  color: 'white',
  fontSize: 14,
  marginLeft: 6,
  fontWeight: '500',
},


  formContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 24,
    textAlign: 'center',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 8,
  },
  required: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#2c3e50',
  },
  inputError: {
    borderColor: '#e74c3c',
    backgroundColor: '#fff5f5',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  successText: {
    color: '#27ae60',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e9ecef',
    flex: 1,
    marginHorizontal: 4,
  },
  radioSelected: {
    backgroundColor: '#ebf3fd',
    borderColor: '#3498db',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#bdc3c7',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleSelected: {
    borderColor: '#3498db',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3498db',
  },
  radioLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  radioLabelSelected: {
    color: '#3498db',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#3498db',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: '#bdc3c7',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonLoading: {
    backgroundColor: '#f39c12',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButtonTextDisabled: {
    color: '#95a5a6',
  },
  statusContainer: {
    marginTop: 12,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusValid: {
    color: '#27ae60',
  },
  statusInvalid: {
    color: '#e67e22',
  },
  registrosContainer: {
    margin: 16,
    marginTop: 0,
  },
  registrosTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  registroCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  registroText: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 4,
  },
  registroLabel: {
    fontWeight: 'bold',
    color: '#34495e',
  },
});  