const { ventas } = require("./datos");
const { totalPorCiudad, ticketPromedio, ventasDelDia, valorVenta } = require("./analitica");

function totalPorCiudadIngenuo(lista) {
  const grupos = {};
  for (const venta of lista) {
    grupos[venta.ciudad] = (grupos[venta.ciudad] ?? 0) + valorVenta(venta);
  }
  return grupos;
}

function ticketPromedioIngenuo(lista) {
  let total = 0;
  for (const venta of lista) total += valorVenta(venta);
  return total / lista.length;
}

const conEspacio = [
  ...ventas,
  { id: 13, fecha: "2026-09-07", cliente: "C09", producto: "Molino manual", ciudad: "Bogotá ", cantidad: 1, precio: 120000 },
];
console.log("ERROR 1 · claves de ciudad");
console.log("  versión preliminar:", Object.keys(totalPorCiudadIngenuo(conEspacio)));
console.log("  versión v0.1      :", Object.keys(totalPorCiudad(conEspacio)));
console.log("  claves en la muestra original (preliminar):", Object.keys(totalPorCiudadIngenuo(ventas)));

const diaSinVentas = ventas.filter((v) => v.fecha === "2026-09-07");
console.log("\nERROR 2 · ticket promedio de un día sin ventas");
console.log("  lista filtrada:", diaSinVentas);
console.log("  versión preliminar: 0 / 0 =", ticketPromedioIngenuo(diaSinVentas));
console.log("  versión v0.1      :", ticketPromedio(diaSinVentas));
console.log("  ventasDelDia v0.1 :", ventasDelDia(ventas, "2026-09-07"));

let fallos = 0;
function comprobar(descripcion, condicion) {
  if (!condicion) fallos++;
  console.log(`${condicion ? "OK" : "FALLA"} · ${descripcion}`);
}
console.log("\nPRUEBAS");
comprobar("la versión preliminar SÍ reproduce el error 1 (claves duplicadas)", Object.keys(totalPorCiudadIngenuo(conEspacio)).length > 4);
comprobar("v0.1 mantiene exactamente 4 ciudades con la entrada que rompía la preliminar", Object.keys(totalPorCiudad(conEspacio)).length === 4);
comprobar("la versión preliminar SÍ reproduce el error 2 (NaN)", Number.isNaN(ticketPromedioIngenuo([])));
comprobar("v0.1: ticketPromedio([]) === 0", ticketPromedio([]) === 0);
comprobar("v0.1: ventasDelDia sin ventas no tiene NaN", Object.values(ventasDelDia(ventas, "2026-09-07")).every((x) => !Number.isNaN(x)));
comprobar(
  "v0.1: un día con solo ventas de cantidad 0 tampoco da NaN",
  ticketPromedio([{ cantidad: 0, precio: 42000, ciudad: "Cali" }]) === 0,
);
console.log(fallos === 0 ? "\nTodo OK ✔" : `\n${fallos} prueba(s) fallaron ✘`);
process.exitCode = fallos === 0 ? 0 : 1;
