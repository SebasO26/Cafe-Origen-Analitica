const { ventas } = require("./datos");
const a = require("./analitica");

const copiaOriginal = JSON.stringify(ventas);

const conEspacios = [
  { id: 101, ciudad: "Bogotá ", cantidad: 2, precio: 1000 },
  { id: 102, ciudad: " BOGOTÁ", cantidad: 1, precio: 500 },
  { id: 103, ciudad: "bogotá", cantidad: 0, precio: 700 },
];
const entradas = {
  "completo (12)": ventas,
  "un elemento": [ventas[6]],
  "vacío": [],
  "con espacios": conEspacios,
};

let fallos = 0;
const filas = [];

function comparar(indicador, entrada, valorCiclo, valorMetodo) {
  const ok = Object.is(valorCiclo, valorMetodo);
  if (!ok) fallos++;
  filas.push({
    indicador,
    entrada,
    ciclo: valorCiclo,
    método: valorMetodo,
    resultado: ok ? "OK" : "DIFERENTE",
  });
}

for (const [nombre, datos] of Object.entries(entradas)) {
  comparar("totalVendido", nombre, a.totalVendido(datos), a.totalVendidoM(datos));
  comparar("unidadesVendidas", nombre, a.unidadesVendidas(datos), a.unidadesVendidasM(datos));
  for (const ciudad of ["Medellín", "Bogotá", "Cali", "Pereira", "  bogotá "]) {
    comparar(`ventasPorCiudad("${ciudad}")`, nombre, a.ventasPorCiudad(datos, ciudad), a.ventasPorCiudadM(datos, ciudad));
  }
}
console.table(filas);

function comprobar(descripcion, condicion) {
  if (!condicion) fallos++;
  console.log(`${condicion ? "OK" : "FALLA"} · ${descripcion}`);
}

const suma = (valores) => valores.reduce((s, v) => s + v, 0);

const porCiudad = a.totalPorCiudad(ventas);
console.log("\ntotalPorCiudad:", porCiudad);
comprobar(
  "totalPorCiudad devuelve exactamente 4 ciudades sin duplicados",
  JSON.stringify(Object.keys(porCiudad).sort()) === JSON.stringify(["Bogotá", "Cali", "Medellín", "Pereira"]),
);
comprobar("la suma de las ciudades coincide con totalVendido", suma(Object.values(porCiudad)) === a.totalVendido(ventas));
comprobar(
  '"Bogotá", "Bogotá " y " BOGOTÁ" caen en un solo grupo',
  JSON.stringify(a.totalPorCiudad(conEspacios)) === JSON.stringify({ Bogotá: 2500 }),
);

console.log("\nunidadesPorProducto:", a.unidadesPorProducto(ventas));
comprobar(
  "unidadesPorProducto suma lo mismo que unidadesVendidas",
  suma(Object.values(a.unidadesPorProducto(ventas))) === a.unidadesVendidas(ventas),
);

const top3 = a.topProductosPorValor(ventas, 3);
console.log("\ntopProductosPorValor(ventas, 3):");
console.table(top3);
comprobar("el top 3 tiene tres productos", top3.length === 3);
comprobar("el top 3 está ordenado de mayor a menor", top3[0].valor >= top3[1].valor && top3[1].valor >= top3[2].valor);
comprobar("topProductosPorValor(ventas, 0) devuelve []", a.topProductosPorValor(ventas, 0).length === 0);
comprobar("topProductosPorValor([], 3) devuelve []", a.topProductosPorValor([], 3).length === 0);
comprobar(
  "totalPorCiudad([]) y unidadesPorProducto([]) devuelven {}",
  Object.keys(a.totalPorCiudad([])).length === 0 && Object.keys(a.unidadesPorProducto([])).length === 0,
);
comprobar("el arreglo ventas conserva su orden y contenido originales", JSON.stringify(ventas) === copiaOriginal);

console.log(fallos === 0 ? "\nTodo OK ✔" : `\n${fallos} verificación(es) fallaron ✘`);
process.exitCode = fallos === 0 ? 0 : 1;
