const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function insertTestData() {
  try {
    console.log('🐝 Insertando datos de prueba para gráficos...');

    // Verificar si existe un usuario para usar como propietario
    const usuarios = await prisma.usuario.findMany();
    if (usuarios.length === 0) {
      console.log('❌ No hay usuarios en la base de datos. Crea un usuario primero.');
      return;
    }

    const usuarioId = usuarios[0].id;
    console.log(`✅ Usando usuario: ${usuarioId}`);

    // 1. Insertar tipos de nodos si no existen
    const tiposNodo = [
      { tipo: 'TEMP', descripcion: 'Sensor de Temperatura' },
      { tipo: 'HUM', descripcion: 'Sensor de Humedad' },
      { tipo: 'PESO', descripcion: 'Sensor de Peso' },
      { tipo: 'CAM', descripcion: 'Cámara' },
      { tipo: 'GPS', descripcion: 'GPS' }
    ];

    for (const tipo of tiposNodo) {
      await prisma.nodo_tipo.upsert({
        where: { tipo: tipo.tipo },
        update: {},
        create: tipo
      });
    }
    console.log('✅ Tipos de nodos insertados');

    // 2. Insertar alertas si no existen
    const alertas = [
      { id: 'ALT001', nombre: 'Temperatura Alta', indicador: 'TEMP_HIGH', descripcion: 'Temperatura superior a 35°C' },
      { id: 'ALT002', nombre: 'Humedad Baja', indicador: 'HUM_LOW', descripcion: 'Humedad inferior a 40%' },
      { id: 'ALT003', nombre: 'Peso Anormal', indicador: 'WEIGHT_ANOM', descripcion: 'Cambio drástico de peso' },
      { id: 'ALT004', nombre: 'Conexión Perdida', indicador: 'CONN_LOST', descripcion: 'Pérdida de conexión del nodo' }
    ];

    for (const alerta of alertas) {
      await prisma.alerta.upsert({
        where: { id: alerta.id },
        update: {},
        create: alerta
      });
    }
    console.log('✅ Alertas insertadas');

    // 3. Insertar colmenas de prueba
    const colmenas = [
      {
        id: 'COL001',
        descripcion: 'Colmena Principal Norte',
        latitud: -33.4489,
        longitud: -70.6693,
        dueno: usuarioId
      },
      {
        id: 'COL002',
        descripcion: 'Colmena Secundaria Sur',
        latitud: -33.4569,
        longitud: -70.6483,
        dueno: usuarioId
      }
    ];

    for (const colmena of colmenas) {
      await prisma.colmena.upsert({
        where: { id: colmena.id },
        update: {},
        create: colmena
      });
    }
    console.log('✅ Colmenas insertadas');

    // 4. Insertar estaciones de prueba
    const estaciones = [
      {
        id: 'EST001',
        descripcion: 'Estación Meteorológica Central',
        latitud: -33.4409,
        longitud: -70.6544,
        dueno: usuarioId
      }
    ];

    for (const estacion of estaciones) {
      await prisma.estacion.upsert({
        where: { id: estacion.id },
        update: {},
        create: estacion
      });
    }
    console.log('✅ Estaciones insertadas');

    // 5. Insertar nodos
    const nodos = [
      { id: 'NOD001', descripcion: 'Sensor Temp Colmena 1', tipo: 'TEMP' },
      { id: 'NOD002', descripcion: 'Sensor Humedad Colmena 1', tipo: 'HUM' },
      { id: 'NOD003', descripcion: 'Sensor Peso Colmena 1', tipo: 'PESO' },
      { id: 'NOD004', descripcion: 'Sensor Temp Colmena 2', tipo: 'TEMP' },
      { id: 'NOD005', descripcion: 'Cámara Colmena 2', tipo: 'CAM' },
      { id: 'NOD006', descripcion: 'GPS Estación 1', tipo: 'GPS' }
    ];

    for (const nodo of nodos) {
      await prisma.nodo.upsert({
        where: { id: nodo.id },
        update: {},
        create: nodo
      });
    }
    console.log('✅ Nodos insertados');

    // 6. Asociar nodos con colmenas
    const nodosColmena = [
      { colmena_id: 'COL001', nodo_id: 'NOD001' },
      { colmena_id: 'COL001', nodo_id: 'NOD002' },
      { colmena_id: 'COL001', nodo_id: 'NOD003' },
      { colmena_id: 'COL002', nodo_id: 'NOD004' },
      { colmena_id: 'COL002', nodo_id: 'NOD005' }
    ];

    for (const nc of nodosColmena) {
      const existing = await prisma.nodo_colmena.findFirst({
        where: { 
          colmena_id: nc.colmena_id,
          nodo_id: nc.nodo_id
        }
      });
      
      if (!existing) {
        await prisma.nodo_colmena.create({
          data: nc
        });
      }
    }
    console.log('✅ Nodos asociados con colmenas');

    // 7. Asociar nodos con estaciones
    const nodosEstacion = [
      { estacion_id: 'EST001', nodo_id: 'NOD006' }
    ];

    for (const ne of nodosEstacion) {
      const existing = await prisma.nodo_estacion.findFirst({
        where: { 
          estacion_id: ne.estacion_id,
          nodo_id: ne.nodo_id
        }
      });
      
      if (!existing) {
        await prisma.nodo_estacion.create({
          data: ne
        });
      }
    }
    console.log('✅ Nodos asociados con estaciones');

    // 8. Insertar mensajes de prueba (últimos 7 días)
    const hoy = new Date();
    const mensajes = [];
    
    for (let i = 0; i < 7; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(fecha.getDate() - i);
      
      // Generar varios mensajes por día
      const mensajesPorDia = Math.floor(Math.random() * 10) + 5; // 5-15 mensajes por día
      
      for (let j = 0; j < mensajesPorDia; j++) {
        const fechaMensaje = new Date(fecha);
        fechaMensaje.setHours(Math.floor(Math.random() * 24));
        fechaMensaje.setMinutes(Math.floor(Math.random() * 60));
        
        const nodoId = nodos[Math.floor(Math.random() * nodos.length)].id;
        
        mensajes.push({
          nodo_id: nodoId,
          topico: `sensor/${nodoId}/data`,
          payload: JSON.stringify({
            value: Math.random() * 100,
            unit: 'celsius',
            timestamp: fechaMensaje.toISOString()
          }),
          fecha: fechaMensaje
        });
      }
    }

    // Insertar mensajes en lotes
    for (const mensaje of mensajes) {
      await prisma.nodo_mensaje.create({
        data: mensaje
      });
    }
    console.log(`✅ ${mensajes.length} mensajes de prueba insertados`);

    // 9. Insertar alertas de prueba (últimos 30 días)
    const alertasPrueba = [];
    
    for (let i = 0; i < 30; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(fecha.getDate() - i);
      
      // Probabilidad de alertas (30% por día)
      if (Math.random() < 0.3) {
        const alertasPorDia = Math.floor(Math.random() * 3) + 1; // 1-3 alertas
        
        for (let j = 0; j < alertasPorDia; j++) {
          const fechaAlerta = new Date(fecha);
          fechaAlerta.setHours(Math.floor(Math.random() * 24));
          fechaAlerta.setMinutes(Math.floor(Math.random() * 60));
          
          const nodoId = nodos[Math.floor(Math.random() * nodos.length)].id;
          const alertaId = alertas[Math.floor(Math.random() * alertas.length)].id;
          
          alertasPrueba.push({
            nodo_id: nodoId,
            alerta_id: alertaId,
            fecha: fechaAlerta
          });
        }
      }
    }

    // Insertar alertas en lotes
    for (const alerta of alertasPrueba) {
      await prisma.nodo_alerta.create({
        data: alerta
      });
    }
    console.log(`✅ ${alertasPrueba.length} alertas de prueba insertadas`);

    console.log('🎉 ¡Datos de prueba insertados exitosamente!');
    console.log('Ahora puedes ver los gráficos en el dashboard.');

  } catch (error) {
    console.error('❌ Error insertando datos de prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  insertTestData();
}

module.exports = insertTestData;
