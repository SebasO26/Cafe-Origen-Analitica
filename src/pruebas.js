const { ventas } = require("./datos");
const a = require("./analitica");

const entradas = [
  ["completo (12)", ventas],
  ["un elemento (id 7)", [ventas[6]]],
  ["vacío", []],
];

const filas = [];
for (const [nombre, datos] of entradas) {
  const mayor = a.ventaMayor(datos);
  filas.push({
    entrada: nombre,
    totalVendido: a.totalVendido(datos),
    unidadesVendidas: a.unidadesVendidas(datos),
    ventaMayor: mayor === null ? null : `id ${mayor.id} ($${a.valorVenta(mayor)})`,
    ticketPromedio: a.ticketPromedio(datos),
    "ciudad Medellín": a.ventasPorCiudad(datos, "Medellín"),
  });
}
console.table(filas);

const conEspacios = [{ id: 99, ciudad: "medellín ", cantidad: 1, precio: 1000 }];
console.log('ventasPorCiudad("Medellín") sobre "medellín " →', a.ventasPorCiudad(conEspacios, "Medellín"));
console.log('ventasPorCiudad("  MEDELLÍN ") sobre la muestra →', a.ventasPorCiudad(ventas, "  MEDELLÍN "));

const sobreVacio = {
  total: a.totalVendido([]),
  unidades: a.unidadesVendidas([]),
  ticket: a.ticketPromedio([]),
  ciudad: a.ventasPorCiudad([], "Cali"),
};
for (const [nombre, valor] of Object.entries(sobreVacio)) {
  if (Number.isNaN(valor)) {
    throw new Error(`${nombre} devolvió NaN con []`);
  }
}
console.log("Sin NaN con arreglo vacío: OK");
