const { ventas } = require("./datos");
const {
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  valorVenta,
  totalPorCiudad,
  unidadesPorProducto,
  topProductosPorValor,
  ventasDelDia,
} = require("./analitica");

const ANCHO = 62;

const pesos = (valor) =>
  valor.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
const numero = (valor) => valor.toLocaleString("es-CO");
const fila = (etiqueta, valor) => `  ${etiqueta.padEnd(ANCHO - 4 - valor.length)}${valor}`;
const titulo = (texto) => `\n${texto.toUpperCase()}\n${"─".repeat(ANCHO)}`;

console.log("═".repeat(ANCHO));
console.log("  CAFÉ ORIGEN · REPORTE DE VENTAS v0.1");
console.log("  Ventas del 2026-09-01 al 2026-09-06");
console.log("═".repeat(ANCHO));

const mayor = ventaMayor(ventas);
console.log(titulo("1. Resumen general"));
console.log(fila("Total vendido", pesos(totalVendido(ventas))));
console.log(fila("Unidades vendidas", numero(unidadesVendidas(ventas))));
console.log(fila("Ticket promedio por compra", pesos(ticketPromedio(ventas))));
console.log(
  fila(
    "Venta más grande",
    mayor === null ? "sin ventas" : `${pesos(valorVenta(mayor))} (id ${mayor.id}, ${mayor.producto})`,
  ),
);

const total = totalVendido(ventas);
console.log(titulo("2. Ventas por ciudad"));
const ciudades = Object.entries(totalPorCiudad(ventas)).sort((x, y) => y[1] - x[1]);
for (const [ciudad, valor] of ciudades) {
  const porcentaje = total === 0 ? 0 : (valor / total) * 100;
  console.log(fila(ciudad, `${pesos(valor)}  ${porcentaje.toFixed(1).padStart(5)}%`));
}

console.log(titulo("3. Unidades por producto"));
const productos = Object.entries(unidadesPorProducto(ventas)).sort((x, y) => y[1] - x[1]);
for (const [producto, unidades] of productos) {
  console.log(fila(producto, `${numero(unidades)} u.`));
}

console.log(titulo("4. Top 3 productos por valor generado"));
topProductosPorValor(ventas, 3).forEach(({ producto, valor }, i) => {
  console.log(fila(`${i + 1}. ${producto}`, pesos(valor)));
});

function imprimirDia(fecha) {
  const d = ventasDelDia(ventas, fecha);
  console.log(`\n  Día ${d.fecha}`);
  if (d.registros === 0) {
    console.log("  (sin ventas registradas este día)");
  }
  console.log(fila("  Ventas válidas", numero(d.ventasValidas)));
  console.log(fila("  Unidades", numero(d.unidades)));
  console.log(fila("  Total vendido", pesos(d.total)));
  console.log(fila("  Ticket promedio", pesos(d.ticketPromedio)));
}

console.log(titulo("Resumen por día"));
imprimirDia("2026-09-05");
imprimirDia("2026-09-07");
console.log(`\n${"═".repeat(ANCHO)}`);
