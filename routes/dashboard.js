const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * DASHBOARD DE SOLO VISUALIZACIÓN
 * 
 * Este módulo contiene únicamente rutas GET para mostrar información
 * de manera visual. No incluye funcionalidades de edición, creación
 * o eliminación de datos. Es apto tanto para usuarios administradores
 * como apicultores, limitándose a la visualización de sus datos.
 */

// GET /dashboard - Página principal del dashboard
router.get('/', async (req, res) => {
  try {
    const userId = req.session.user.id;

    // Obtener estadísticas básicas del usuario
    const [colmenasCount, estacionesCount] = await Promise.all([
      prisma.colmena.count({
        where: { dueno: userId }
      }),
      prisma.estacion.count({
        where: { dueno: userId }
      })
    ]);

    // Obtener datos para gráficos
    const [
      alertasPorTipo,
      nodosPorTipo,
      mensajesUltimos7Dias,
      alertasUltimos30Dias,
      colmenasData,
      estacionesData,
      datosTemperaturaColmenas
    ] = await Promise.all([
      // Alertas por tipo - del usuario actual
      prisma.nodo_alerta.findMany({
        where: {
          nodo: {
            OR: [
              {
                nodo_colmena: {
                  some: {
                    colmena: {
                      dueno: userId
                    }
                  }
                }
              },
              {
                nodo_estacion: {
                  some: {
                    estacion: {
                      dueno: userId
                    }
                  }
                }
              }
            ]
          }
        },
        include: {
          alerta: true,
          nodo: {
            include: {
              nodo_colmena: {
                include: {
                  colmena: true
                }
              },
              nodo_estacion: {
                include: {
                  estacion: true
                }
              }
            }
          }
        }
      }),

      // Nodos por tipo - del usuario actual
      prisma.nodo.findMany({
        where: {
          OR: [
            {
              nodo_colmena: {
                some: {
                  colmena: {
                    dueno: userId
                  }
                }
              }
            },
            {
              nodo_estacion: {
                some: {
                  estacion: {
                    dueno: userId
                  }
                }
              }
            }
          ]
        },
        include: {
          nodo_tipo: true,
          nodo_colmena: {
            include: {
              colmena: true
            }
          },
          nodo_estacion: {
            include: {
              estacion: true
            }
          }
        }
      }),

      // Mensajes de los últimos 7 días
      prisma.nodo_mensaje.findMany({
        where: {
          fecha: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          },
          nodo: {
            OR: [
              {
                nodo_colmena: {
                  some: {
                    colmena: {
                      dueno: userId
                    }
                  }
                }
              },
              {
                nodo_estacion: {
                  some: {
                    estacion: {
                      dueno: userId
                    }
                  }
                }
              }
            ]
          }
        },
        orderBy: {
          fecha: 'desc'
        }
      }),

      // Alertas de los últimos 30 días
      prisma.nodo_alerta.findMany({
        where: {
          fecha: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          },
          nodo: {
            OR: [
              {
                nodo_colmena: {
                  some: {
                    colmena: {
                      dueno: userId
                    }
                  }
                }
              },
              {
                nodo_estacion: {
                  some: {
                    estacion: {
                      dueno: userId
                    }
                  }
                }
              }
            ]
          }
        },
        include: {
          alerta: true
        },
        orderBy: {
          fecha: 'desc'
        }
      }),

      // Datos de colmenas del usuario
      prisma.colmena.findMany({
        where: { dueno: userId },
        include: {
          nodo_colmena: {
            include: {
              nodo: {
                include: {
                  nodo_tipo: true
                }
              }
            }
          }
        }
      }),

      // Datos de estaciones del usuario
      prisma.estacion.findMany({
        where: { dueno: userId },
        include: {
          nodo_estacion: {
            include: {
              nodo: {
                include: {
                  nodo_tipo: true
                }
              }
            }
          }
        }
      }),

      // Obtener datos de temperatura más recientes para cada colmena
      getLatestTemperatureData(userId)
    ]);

    // Procesar datos para gráficos de visualización
    const chartData = {
      alertasPorTipo: processAlertasPorTipo(alertasPorTipo),
      nodosPorTipo: processNodosPorTipo(nodosPorTipo, userId),
      mensajesPorDia: processMensajesPorDia(mensajesUltimos7Dias),
      alertasPorDia: processAlertasPorDia(alertasUltimos30Dias),
      distribucionNodos: processDistribucionNodos(colmenasData, estacionesData),
      temperaturasColmenas: processTemperaturasColmenas(datosTemperaturaColmenas)
    };

    res.render('dashboard/index', {
      title: 'Dashboard de Visualización - Smart Bee',
      colmenasCount,
      estacionesCount,
      alertasCount: alertasUltimos30Dias.length,
      mensajesCount: mensajesUltimos7Dias.length,
      chartData: JSON.stringify(chartData),
      colmenasInfo: datosTemperaturaColmenas
    });

  } catch (error) {
    console.error('Error al cargar dashboard:', error);
    req.flash('error', 'Error al cargar el dashboard');
    res.redirect('/auth/login');
  }
});

// Funciones de procesamiento de datos
function processAlertasPorTipo(alertas) {
  const alertasPorTipo = {};
  alertas.forEach(alerta => {
    const tipo = alerta.alerta.nombre;
    alertasPorTipo[tipo] = (alertasPorTipo[tipo] || 0) + 1;
  });

  return {
    labels: Object.keys(alertasPorTipo),
    data: Object.values(alertasPorTipo)
  };
}

function processNodosPorTipo(nodos, userId) {
  const nodosPorTipo = {};

  nodos.forEach(nodo => {
    const tipoDescripcion = nodo.nodo_tipo.descripcion;
    nodosPorTipo[tipoDescripcion] = (nodosPorTipo[tipoDescripcion] || 0) + 1;
  });

  return {
    labels: Object.keys(nodosPorTipo),
    data: Object.values(nodosPorTipo)
  };
}

function processMensajesPorDia(mensajes) {
  const mensajesPorDia = {};
  const hoy = new Date();

  // Inicializar últimos 7 días
  for (let i = 6; i >= 0; i--) {
    const fecha = new Date(hoy);
    fecha.setDate(fecha.getDate() - i);
    const fechaStr = fecha.toISOString().split('T')[0];
    mensajesPorDia[fechaStr] = 0;
  }

  // Contar mensajes por día
  mensajes.forEach(mensaje => {
    const fechaStr = mensaje.fecha.toISOString().split('T')[0];
    if (mensajesPorDia.hasOwnProperty(fechaStr)) {
      mensajesPorDia[fechaStr]++;
    }
  });

  return {
    labels: Object.keys(mensajesPorDia).map(fecha => {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    }),
    data: Object.values(mensajesPorDia)
  };
}

function processAlertasPorDia(alertas) {
  const alertasPorDia = {};
  const hoy = new Date();

  // Inicializar últimos 30 días
  for (let i = 29; i >= 0; i--) {
    const fecha = new Date(hoy);
    fecha.setDate(fecha.getDate() - i);
    const fechaStr = fecha.toISOString().split('T')[0];
    alertasPorDia[fechaStr] = 0;
  }

  // Contar alertas por día
  alertas.forEach(alerta => {
    const fechaStr = alerta.fecha.toISOString().split('T')[0];
    if (alertasPorDia.hasOwnProperty(fechaStr)) {
      alertasPorDia[fechaStr]++;
    }
  });

  // Filtrar solo los últimos 7 días para el gráfico
  const ultimos7Dias = Object.keys(alertasPorDia).slice(-7);

  return {
    labels: ultimos7Dias.map(fecha => {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    }),
    data: ultimos7Dias.map(fecha => alertasPorDia[fecha])
  };
}

function processDistribucionNodos(colmenas, estaciones) {
  let totalNodosColmenas = 0;
  let totalNodosEstaciones = 0;

  colmenas.forEach(colmena => {
    totalNodosColmenas += colmena.nodo_colmena.length;
  });

  estaciones.forEach(estacion => {
    totalNodosEstaciones += estacion.nodo_estacion.length;
  });

  return {
    labels: ['Nodos en Colmenas', 'Nodos en Estaciones'],
    data: [totalNodosColmenas, totalNodosEstaciones]
  };
}

function processTemperaturasColmenas(colmenasData) {
  const colmenasConTemperatura = colmenasData.filter(colmena => 
    colmena.temperaturaInterna !== null || colmena.temperaturaExterna !== null
  );

  if (colmenasConTemperatura.length === 0) {
    return {
      labels: [],
      temperaturaInterna: [],
      temperaturaExterna: []
    };
  }

  const labels = colmenasConTemperatura.map(colmena => colmena.descripcion || `Colmena ${colmena.id}`);
  const temperaturaInterna = colmenasConTemperatura.map(colmena => colmena.temperaturaInterna || 0);
  const temperaturaExterna = colmenasConTemperatura.map(colmena => colmena.temperaturaExterna || 0);

  return {
    labels,
    temperaturaInterna,
    temperaturaExterna
  };
}

// GET /dashboard/profile - Vista del perfil del usuario (solo lectura)
router.get('/profile', (req, res) => {
  res.render('dashboard/profile', {
    title: 'Mi Perfil - Vista - Smart Bee'
  });
});

// API route para obtener datos de gráficos
router.get('/api/chart-data', async (req, res) => {
  try {
    const userId = req.session.user.id;

    // Obtener datos actualizados para gráficos
    const [
      alertasUltimos30Dias,
      mensajesUltimos7Dias,
      nodosPorTipo,
      colmenasData,
      estacionesData,
      datosTemperaturaColmenas
    ] = await Promise.all([
      // Alertas de los últimos 30 días
      prisma.nodo_alerta.findMany({
        where: {
          fecha: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          },
          nodo: {
            OR: [
              {
                nodo_colmena: {
                  some: {
                    colmena: {
                      dueno: userId
                    }
                  }
                }
              },
              {
                nodo_estacion: {
                  some: {
                    estacion: {
                      dueno: userId
                    }
                  }
                }
              }
            ]
          }
        },
        include: {
          alerta: true
        }
      }),

      // Mensajes de los últimos 7 días
      prisma.nodo_mensaje.findMany({
        where: {
          fecha: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          },
          nodo: {
            OR: [
              {
                nodo_colmena: {
                  some: {
                    colmena: {
                      dueno: userId
                    }
                  }
                }
              },
              {
                nodo_estacion: {
                  some: {
                    estacion: {
                      dueno: userId
                    }
                  }
                }
              }
            ]
          }
        }
      }),

      // Nodos por tipo - obtener directamente los nodos del usuario
      prisma.nodo.findMany({
        where: {
          OR: [
            {
              nodo_colmena: {
                some: {
                  colmena: {
                    dueno: userId
                  }
                }
              }
            },
            {
              nodo_estacion: {
                some: {
                  estacion: {
                    dueno: userId
                  }
                }
              }
            }
          ]
        },
        include: {
          nodo_tipo: true,
          nodo_colmena: {
            include: {
              colmena: true
            }
          },
          nodo_estacion: {
            include: {
              estacion: true
            }
          }
        }
      }),

      // Datos de colmenas del usuario
      prisma.colmena.findMany({
        where: { dueno: userId },
        include: {
          nodo_colmena: {
            include: {
              nodo: {
                include: {
                  nodo_tipo: true
                }
              }
            }
          }
        }
      }),

      // Datos de estaciones del usuario
      prisma.estacion.findMany({
        where: { dueno: userId },
        include: {
          nodo_estacion: {
            include: {
              nodo: {
                include: {
                  nodo_tipo: true
                }
              }
            }
          }
        }
      }),

      // Obtener datos de temperatura más recientes para cada colmena
      getLatestTemperatureData(userId)
    ]);

    // Procesar datos para gráficos
    const chartData = {
      alertasPorTipo: processAlertasPorTipo(alertasUltimos30Dias),
      nodosPorTipo: processNodosPorTipo(nodosPorTipo, userId),
      mensajesPorDia: processMensajesPorDia(mensajesUltimos7Dias),
      alertasPorDia: processAlertasPorDia(alertasUltimos30Dias),
      distribucionNodos: processDistribucionNodos(colmenasData, estacionesData),
      temperaturasColmenas: processTemperaturasColmenas(datosTemperaturaColmenas)
    };

    res.json(chartData);

  } catch (error) {
    console.error('Error al obtener datos de gráficos:', error);
    res.status(500).json({ error: 'Error al obtener datos de gráficos' });
  }
});

// Función para obtener datos de temperatura más recientes de las colmenas
async function getLatestTemperatureData(userId) {
  try {
    const colmenas = await prisma.colmena.findMany({
      where: { dueno: userId },
      include: {
        nodo_colmena: {
          include: {
            nodo: {
              include: {
                nodo_tipo: true,
                nodo_mensaje: {
                  orderBy: {
                    fecha: 'desc'
                  },
                  take: 5 // Obtener los últimos 5 mensajes para análisis
                }
              }
            }
          }
        }
      }
    });

    const colmenasConTemperatura = [];

    for (const colmena of colmenas) {
      const colmenaInfo = {
        id: colmena.id,
        descripcion: colmena.descripcion,
        temperaturaInterna: 31,
        temperaturaExterna: 28,
        humedad: 60,
        peso: 1.5,
        ultimaLectura: null,
        estado: 'Sin datos',
        alertas: []
      };

      // Buscar nodos de la colmena y sus últimos mensajes
      for (const nodoColmena of colmena.nodo_colmena) {
        const nodo = nodoColmena.nodo;
        
        if (nodo.nodo_mensaje && nodo.nodo_mensaje.length > 0) {
          const ultimoMensaje = nodo.nodo_mensaje[0];
          
          try {
            const payload = JSON.parse(ultimoMensaje.payload);
            
            // Determinar tipo de sensor basado en el tópico o tipo de nodo
            if (nodo.nodo_tipo.descripcion.toLowerCase().includes('colmena') || 
                ultimoMensaje.topico.includes('temperature') ||
                ultimoMensaje.topico.includes('temp')) {
              
              if (payload.temperatura_interna || payload.temp_internal) {
                colmenaInfo.temperaturaInterna = payload.temperatura_interna || payload.temp_internal;
              }
              
              if (payload.temperatura_externa || payload.temp_external) {
                colmenaInfo.temperaturaExterna = payload.temperatura_externa || payload.temp_external;
              }
              
              if (payload.humedad || payload.humidity) {
                colmenaInfo.humedad = payload.humedad || payload.humidity;
              }
              
              if (payload.peso || payload.weight) {
                colmenaInfo.peso = payload.peso || payload.weight;
              }
              
              // Si solo hay un valor de temperatura sin especificar tipo
              if (payload.value && payload.unit && payload.unit.includes('celsius')) {
                if (!colmenaInfo.temperaturaInterna) {
                  colmenaInfo.temperaturaInterna = payload.value;
                }
              }
            }
            
            // Actualizar la fecha de última lectura
            if (!colmenaInfo.ultimaLectura || ultimoMensaje.fecha > colmenaInfo.ultimaLectura) {
              colmenaInfo.ultimaLectura = ultimoMensaje.fecha;
            }
          } catch (parseError) {
            console.log('Error parsing payload:', parseError);
          }
        }
      }

      // Determinar estado de la colmena
      if (colmenaInfo.ultimaLectura) {
        const tiempoTranscurrido = Date.now() - new Date(colmenaInfo.ultimaLectura).getTime();
        const horasTranscurridas = tiempoTranscurrido / (1000 * 60 * 60);
        
        if (horasTranscurridas < 1) {
          colmenaInfo.estado = 'Activa';
        } else if (horasTranscurridas < 24) {
          colmenaInfo.estado = 'Normal';
        } else {
          colmenaInfo.estado = 'Inactiva';
        }
      }

      // Evaluar condiciones de alerta para temperaturas
      if (colmenaInfo.temperaturaInterna !== null) {
        if (colmenaInfo.temperaturaInterna > 38) {
          colmenaInfo.alertas.push({ tipo: 'critica', mensaje: 'Temperatura interna crítica' });
        } else if (colmenaInfo.temperaturaInterna > 36) {
          colmenaInfo.alertas.push({ tipo: 'advertencia', mensaje: 'Temperatura interna alta' });
        } else if (colmenaInfo.temperaturaInterna < 12) {
          colmenaInfo.alertas.push({ tipo: 'critica', mensaje: 'Temperatura interna muy baja' });
        }
      }

      colmenasConTemperatura.push(colmenaInfo);
    }

    return colmenasConTemperatura;
  } catch (error) {
    console.error('Error obteniendo datos de temperatura:', error);
    return [];
  }
}

module.exports = router;
