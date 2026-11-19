function normalizar(texto) {
  return String(texto ?? "").trim().toLowerCase();
}

function valorVenta(venta) {
  return venta.cantidad * venta.precio;
}

function totalVendido(ventas) {
  let total = 0;
  for (const venta of ventas) {
    total = total + valorVenta(venta);
  }
  return total;
}

function unidadesVendidas(ventas) {
  let unidades = 0;
  for (const venta of ventas) {
    unidades = unidades + venta.cantidad;
  }
  return unidades;
}

function ventaMayor(ventas) {
  let mayor = null;
  for (const venta of ventas) {
    if (venta.cantidad > 0) {
      if (mayor === null || valorVenta(venta) > valorVenta(mayor)) {
        mayor = venta;
      }
    }
  }
  return mayor;
}

function ticketPromedio(ventas) {
  let total = 0;
  let validas = 0;
  for (const venta of ventas) {
    if (venta.cantidad > 0) {
      total = total + valorVenta(venta);
      validas = validas + 1;
    }
  }
  if (validas === 0) {
    return 0;
  }
  return total / validas;
}

function ventasPorCiudad(ventas, ciudad) {
  const buscada = normalizar(ciudad);
  let total = 0;
  for (const venta of ventas) {
    if (normalizar(venta.ciudad) === buscada) {
      total = total + valorVenta(venta);
    }
  }
  return total;
}

function totalVendidoM(ventas) {
  return ventas.map(valorVenta).reduce((suma, valor) => suma + valor, 0);
}

function unidadesVendidasM(ventas) {
  return ventas.reduce((suma, venta) => suma + venta.cantidad, 0);
}

function ventasPorCiudadM(ventas, ciudad) {
  const buscada = normalizar(ciudad);
  return ventas
    .filter((venta) => normalizar(venta.ciudad) === buscada)
    .map(valorVenta)
    .reduce((suma, valor) => suma + valor, 0);
}

function nombreCanonico(texto) {
  return normalizar(texto)
    .split(" ")
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");
}

function totalPorCiudad(ventas) {
  return ventas.reduce((grupos, venta) => {
    const ciudad = nombreCanonico(venta.ciudad);
    grupos[ciudad] = (grupos[ciudad] ?? 0) + valorVenta(venta);
    return grupos;
  }, {});
}

function unidadesPorProducto(ventas) {
  return ventas.reduce((grupos, venta) => {
    const producto = String(venta.producto).trim();
    grupos[producto] = (grupos[producto] ?? 0) + venta.cantidad;
    return grupos;
  }, {});
}

function valorPorProducto(ventas) {
  return ventas.reduce((grupos, venta) => {
    const producto = String(venta.producto).trim();
    grupos[producto] = (grupos[producto] ?? 0) + valorVenta(venta);
    return grupos;
  }, {});
}

function topProductosPorValor(ventas, k) {
  if (!Number.isInteger(k) || k <= 0) {
    return [];
  }
  const filas = [...Object.entries(valorPorProducto(ventas))].map(([producto, valor]) => ({ producto, valor }));
  return filas
    .sort((x, y) => y.valor - x.valor || x.producto.localeCompare(y.producto))
    .slice(0, k);
}

function ventasDelDia(ventas, fecha) {
  const buscada = String(fecha ?? "").trim();
  const delDia = ventas.filter((venta) => String(venta.fecha).trim() === buscada);
  return {
    fecha: buscada,
    registros: delDia.length,
    ventasValidas: delDia.filter((venta) => venta.cantidad > 0).length,
    unidades: unidadesVendidas(delDia),
    total: totalVendido(delDia),
    ticketPromedio: ticketPromedio(delDia),
  };
}

module.exports = {
  ventasDelDia,
  normalizar,
  valorVenta,
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  ventasPorCiudad,
  totalVendidoM,
  unidadesVendidasM,
  ventasPorCiudadM,
  nombreCanonico,
  totalPorCiudad,
  unidadesPorProducto,
  valorPorProducto,
  topProductosPorValor,
};
