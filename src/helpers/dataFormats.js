import { flatten } from 'rambdax';

export const formatDate = date => {
  const d = new Date(date);
  let month = `${d.getMonth() + 1}`;
  let day = `${d.getDate()}`;
  const year = d.getFullYear();

  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;

  return [day, month, year].join('-');
};

export const formatStringDate = date => {
  if (date) {
    return date.split('T')[0];
  }
  return null;
};

export const getTextByKey = key => {
  const attributes = {
    technical: 'Técnico',
    manager: 'Manager',
    admin: 'Integración',
    email: 'Correo',
    identification: 'Cédula',
    fullName: 'Nombre',
    typeName: 'Tipo de Orden',
    active: 'Activo',
    inactive: 'Inactivo',
    locked: 'Bloqueado',
    registrada: 'Registrada',
    programada: 'Programada',
    aceptada: 'Aceptada',
    movilizandose: 'Movilizandose',
    'en progreso': 'En Proceso',
    pausada: 'Pausada',
    ejecutada: 'Ejecutada',
    completada: 'Completada',
    verificada: 'Verificada',
    cancelada: 'Cancelada',
    executionDate: 'Fecha de Ejecución',
    baja: 'Baja',
    media: 'Media',
    alta: 'Alta',
    min: 'Mínimo',
    max: 'Máximo',
    defaultValue: 'Valor por defecto',
    title: 'Titulo',
    options: 'Opciones',
    address: 'Dirección',
    priority: 'Prioridad',
    orderTypeId: 'Tipo de Orden',
    firstName: 'Nombre',
    lastName: 'Apellido',
    type: 'Tipo de Orden',
    startDate: 'Fecha de Ejecución Inicio',
    endDate: 'Fecha de Ejecución Fin',
  };
  return attributes[key];
};

const schemas = {
  user: [
    'firstName',
    'lastName',
    'identification',
    'email',
    'role',
    'state',
    'password',
    'scopes',
    'profiles',
  ],
  userToEdit: [
    'firstName',
    'lastName',
    'email',
    'role',
    'state',
    'password',
    'profiles',
    'scopes',
  ],
  orderTypes: ['typeName', 'orderColor', 'description'],
  orders: [
    'orderTypeId',
    'address',
    'latitude',
    'longitude',
    'priority',
    'managerId',
    'technicalId',
    'executionDate',
  ],
  orderToEdit: [
    'address',
    'latitude',
    'longitude',
    'priority',
    'managerId',
    'technicalId',
    'executionDate',
  ],
};

export const getObjectBySchema = (oldObj, newObj, schema) => {
  const attr = {};
  schemas[schema].forEach(key => {
    if (oldObj[key] !== newObj[key]) {
      attr[key] = newObj[key] || null;
    }
  });
  return attr;
};

export const flattenFields = fields => {
  return fields.reduce((acc, field) => {
    if (field.subforms && field.subforms.length) {
      const subformFields = flatten(
        field.subforms.map(subform => subform.fields),
      );
      return [...acc, ...subformFields, field];
    }
    return [...acc, field];
  }, []);
};
