# Bitácora · Café Origen Analítica

## MiniReto 1 · El repositorio y los datos

### Diccionario de datos

Cada registro del arreglo `ventas` representa **una línea de venta**: un cliente compró una cantidad de un producto en una ciudad y fecha determinadas.

| Propiedad | Tipo (JS) | Significado |
|---|---|---|
| `id` | number | Identificador único y consecutivo de la venta (1 a 12). |
| `fecha` | string | Fecha de la venta en formato `AAAA-MM-DD`. Es texto, no un objeto `Date`; al ser formato ISO, comparar por igualdad de texto funciona. |
| `cliente` | string | Código del cliente (`C01` a `C08`). Un mismo cliente puede aparecer en varias ventas. |
| `producto` | string | Nombre del producto vendido, incluye la presentación (por ejemplo `Origen Huila 500 g`). |
| `ciudad` | string | Ciudad donde se hizo la venta. Texto escrito a mano, sin normalizar. |
| `cantidad` | number | Unidades vendidas en esa línea. |
| `precio` | number | Precio **unitario** en pesos colombianos (COP). El valor de la venta es `cantidad × precio`. |

### Casos borde detectados

| # | Problema | Dónde | Decisión |
|---|---|---|---|
| 1 | **Ciudad con mayúsculas inconsistentes**: `medellín` (minúscula) frente a `Medellín`. Un conteo literal crearía dos grupos para la misma ciudad. En datos reales también pueden venir espacios sobrantes (`"Bogotá "`). | id 5 | No modifico `datos.js`. Normalizo **al comparar y agrupar** con `trim().toLowerCase()`. Para mostrar uso el nombre en forma canónica (primera letra en mayúscula). |
| 2 | **Cantidad igual a 0**: una venta sin unidades no es una venta real. | id 8 (C06, Cali) | Sigue en los datos, pero **no cuenta como venta válida** para el ticket promedio (denominador). Aporta $0 al total y 0 unidades, así que no distorsiona las sumas. |
| 3 | **Clientes repetidos**: C01 (ids 1, 4, 11), C02 (2, 7), C03 (3, 9). El código de cliente no identifica una compra. | varios | "Ticket promedio" = valor total ÷ **ventas válidas** (líneas), no ÷ clientes únicos. Queda escrito para que nadie lo confunda con gasto por cliente. |
| 4 | **Productos con la presentación en el nombre** (`Origen Huila 500 g` y `Origen Nariño 250 g`). Son productos distintos por tamaño. | varios | Agrupo por el nombre completo del producto, tal como viene. |
| 5 | **Fechas como texto**. | todos | Comparo fechas por igualdad de texto `AAAA-MM-DD` (válido por ser formato ISO). |
| 6 | **Arreglo vacío** (por ejemplo al filtrar un día sin ventas). | análisis | Las funciones nunca devuelven `NaN`; ver decisiones en el MiniReto 2. |

---

## MiniReto 2 · Los números del día (con ciclos)

### Pseudocódigo (escrito antes de programar)

**Función auxiliar `normalizar(texto)`:** devuelve `texto` sin espacios en los extremos y en minúsculas. Sirve para comparar ciudades.

**`valorVenta(venta)`**
```
DEVOLVER venta.cantidad × venta.precio
```

**`totalVendido(ventas)`** — patrón acumulador. Recorro todas las ventas. Inicio en 0 porque es el elemento neutro de la suma.
```
total ← 0
PARA CADA venta EN ventas:
    total ← total + valorVenta(venta)
DEVOLVER total
```

**`unidadesVendidas(ventas)`** — patrón acumulador. Recorro todas las ventas. Inicio en 0.
```
unidades ← 0
PARA CADA venta EN ventas:
    unidades ← unidades + venta.cantidad
DEVOLVER unidades
```

**`ventaMayor(ventas)`** — patrón máximo. Recorro todas las ventas. Condición: solo cuentan las ventas válidas (cantidad mayor que 0). Inicio en `null` porque todavía no hay candidata. Devuelve el registro completo, no solo el valor.
```
mayor ← null
PARA CADA venta EN ventas:
    SI venta.cantidad > 0:
        SI mayor = null O valorVenta(venta) > valorVenta(mayor):
            mayor ← venta
DEVOLVER mayor
```

**`ticketPromedio(ventas)`** — acumulador más contador. Recorro todas las ventas. Condición: venta válida (cantidad mayor que 0). Acumulo el valor y cuento las ventas válidas. Inicio ambos en 0.
```
total ← 0
validas ← 0
PARA CADA venta EN ventas:
    SI venta.cantidad > 0:
        total ← total + valorVenta(venta)
        validas ← validas + 1
SI validas = 0:
    DEVOLVER 0
DEVOLVER total ÷ validas
```
La guarda `validas = 0` evita dividir 0 ÷ 0, que daría `NaN`.

**`ventasPorCiudad(ventas, ciudad)`** — acumulador con condición. Recorro todas las ventas. Condición: la ciudad normalizada coincide con la buscada (ignora mayúsculas y espacios sobrantes). Acumulo el valor. Inicio en 0.
```
buscada ← normalizar(ciudad)
total ← 0
PARA CADA venta EN ventas:
    SI normalizar(venta.ciudad) = buscada:
        total ← total + valorVenta(venta)
DEVOLVER total
```

### Decisión: ¿qué devuelve cada función con el arreglo vacío?

| Función | `[]` devuelve | Razón |
|---|---|---|
| `totalVendido([])` | `0` | El acumulador nunca cambia: la suma de nada es 0. |
| `unidadesVendidas([])` | `0` | Igual que la anterior. |
| `ventaMayor([])` | `null` | No existe ningún registro que devolver; `null` expresa "no hay venta". Quien la use debe comprobar `null`. |
| `ticketPromedio([])` | `0` | Dividir 0 ÷ 0 daría `NaN`; se protege con la guarda `validas === 0`. Mismo valor si todas las ventas tienen cantidad 0. |
| `ventasPorCiudad([], c)` | `0` | Ninguna venta coincide: suma vacía. |

`ventaMayor` solo considera ventas con `cantidad > 0`. Si todas son inválidas, también devuelve `null`.

### Resultados del programa (muestra completa)

| Indicador | Resultado |
|---|---|
| `totalVendido` | $985.000 |
| `unidadesVendidas` | 21 |
| `ventaMayor` | id 10, Origen Huila 500 g, Pereira, 4 × $42.000 = $168.000 |
| `ticketPromedio` | $89.545,45 (985.000 ÷ 11 ventas válidas) |
| `ventasPorCiudad("Medellín")` | $356.000 (incluye la venta id 5, escrita `medellín`) |

### Trazas manuales

**Traza 1 · `totalVendido` con la muestra completa**

| Vuelta | id | cantidad × precio | valorVenta | total acumulado |
|---|---|---|---|---|
| inicio | | | | 0 |
| 1 | 1 | 2 × 42.000 | 84.000 | 84.000 |
| 2 | 2 | 1 × 26.000 | 26.000 | 110.000 |
| 3 | 3 | 1 × 95.000 | 95.000 | 205.000 |
| 4 | 4 | 1 × 42.000 | 42.000 | 247.000 |
| 5 | 5 | 3 × 45.000 | 135.000 | 382.000 |
| 6 | 6 | 2 × 26.000 | 52.000 | 434.000 |
| 7 | 7 | 1 × 120.000 | 120.000 | 554.000 |
| 8 | 8 | 0 × 42.000 | 0 | 554.000 |
| 9 | 9 | 2 × 45.000 | 90.000 | 644.000 |
| 10 | 10 | 4 × 42.000 | 168.000 | 812.000 |
| 11 | 11 | 1 × 95.000 | 95.000 | 907.000 |
| 12 | 12 | 3 × 26.000 | 78.000 | **985.000** |

Coincide con el programa: `totalVendido(ventas)` = 985000. ✔

**Traza 2 · `ventasPorCiudad(ventas, "Medellín")`**

`buscada` = `"medellín"`

| id | ciudad original | normalizada | ¿coincide? | valorVenta | total acumulado |
|---|---|---|---|---|---|
| inicio | | | | | 0 |
| 1 | Medellín | medellín | sí | 84.000 | 84.000 |
| 2 | Bogotá | bogotá | no | | 84.000 |
| 3 | Cali | cali | no | | 84.000 |
| 4 | Medellín | medellín | sí | 42.000 | 126.000 |
| 5 | medellín | medellín | **sí** | 135.000 | 261.000 |
| 6 a 10 | Bogotá, Bogotá, Cali, Cali, Pereira | | no | | 261.000 |
| 11 | Medellín | medellín | sí | 95.000 | **356.000** |
| 12 | Bogotá | bogotá | no | | 356.000 |

Coincide con el programa: 356000. Sin normalizar, la venta id 5 ($135.000) se habría perdido. ✔

**Traza 3 · `ventaMayor` (máximo)**

| id | ¿cantidad > 0? | valorVenta | mayor tras la vuelta |
|---|---|---|---|
| 1 | sí | 84.000 | id 1 (84.000) |
| 2 | sí | 26.000 | id 1 |
| 3 | sí | 95.000 | id 3 (95.000) |
| 4 | sí | 42.000 | id 3 |
| 5 | sí | 135.000 | id 5 (135.000) |
| 6 | sí | 52.000 | id 5 |
| 7 | sí | 120.000 | id 5 (120.000 no supera a 135.000) |
| 8 | **no** (cantidad 0) | se ignora | id 5 |
| 9 | sí | 90.000 | id 5 |
| 10 | sí | 168.000 | **id 10 (168.000 > 135.000)** |
| 11 | sí | 95.000 | id 10 |
| 12 | sí | 78.000 | id 10 |

Resultado de la traza: la venta mayor es la **id 10** (4 × 42.000 = $168.000). Coincide con el programa. ✔

El Molino manual tiene el precio unitario más alto ($120.000), pero una venta se mide por `cantidad × precio`, así que no es la mayor.

---

## MiniReto 3 · Del ciclo al método

### Las cinco preguntas sobre colecciones, función por función

| Función | ¿Qué recorro? | ¿Qué filtro? | ¿Qué transformo? | ¿Qué acumulo? | ¿Cómo agrupo? |
|---|---|---|---|---|---|
| `totalVendidoM` | todas las ventas | nada | cada venta → su valor (`map(valorVenta)`) | suma de valores, `reduce` con valor inicial `0` | no agrupa |
| `unidadesVendidasM` | todas las ventas | nada | nada (se lee `cantidad` directo) | suma de cantidades, inicial `0` | no agrupa |
| `ventasPorCiudadM` | todas las ventas | las de la ciudad buscada, comparando `normalizar(...)` (`filter`) | cada venta → su valor (`map`) | suma de valores, inicial `0` | no agrupa (una sola ciudad) |
| `totalPorCiudad` | todas las ventas | nada | nombre de ciudad → forma canónica (`Bogotá`); venta → valor | valor por ciudad, inicial `{}` | por ciudad: objeto usado como diccionario `{ciudad: total}` |
| `unidadesPorProducto` | todas las ventas | nada | nombre de producto sin espacios sobrantes | unidades por producto, inicial `{}` | por producto: diccionario `{producto: unidades}` |
| `topProductosPorValor` | las entradas del diccionario valor-por-producto (`Object.entries`) | solo los k primeros tras ordenar (`slice(0, k)`) | entradas `[producto, valor]` → objetos `{producto, valor}` (`map`) | la suma ocurre en `valorPorProducto`, con `reduce` inicial `{}` | por producto, y luego ordenamiento descendente con `sort((x, y) => y.valor - x.valor)` |

### Decisiones

- **Valor inicial en todos los `reduce`** (`0` o `{}`): sin él, `reduce` sobre `[]` lanza un error. Con él, `totalVendidoM([])` devuelve `0`, igual que la versión con ciclo.
- **`sort` modifica el arreglo sobre el que se llama.** En `topProductosPorValor` nunca se ordena `ventas`: se parte de `Object.entries(...)` (arreglo nuevo), se copia con `[...]` y recién entonces se ordena. Comprobado en `verificar.js`: `ventas` conserva su orden.
- **`sort` con función de comparación:** sin ella, JavaScript ordena como texto (`"168000"` antes que `"85000"`). Se usa `y.valor - x.valor` para descendente; en empate, orden alfabético para que el resultado sea estable y repetible.
- **Sin grupos duplicados:** las claves de `totalPorCiudad` salen de `nombreCanonico` (trim, minúsculas y primera letra en mayúscula). `medellín`, `Medellín` y `"Medellín "` caen en la clave `Medellín`.
- **`k` inválido** (0, negativo, no entero) → `[]`.

### Resultados

| Función | Resultado |
|---|---|
| `totalPorCiudad` | Medellín 356.000 · Bogotá 276.000 · Cali 185.000 · Pereira 168.000 (suma 985.000) |
| `unidadesPorProducto` | Huila 7 · Nariño 6 · Sierra 5 · Prensa francesa 2 · Molino manual 1 (suma 21) |
| `topProductosPorValor(ventas, 3)` | 1. Origen Huila 500 g $294.000 · 2. Origen Sierra 500 g $225.000 · 3. Prensa francesa $190.000 |

### Verificación ciclo vs. método

`node src/verificar.js` compara cada par con 4 entradas (completa, un elemento, vacío y con ciudades con espacios y mayúsculas) y 5 ciudades. Los 28 pares dan **OK** y las comprobaciones adicionales también (4 ciudades sin duplicados, `ventas` sin alterar, etc.).

---

## MiniReto 4 · Analítica v0.1: el primer reporte

### Nuevo en este reto

- `ventasDelDia(ventas, fecha)` devuelve `{ fecha, registros, ventasValidas, unidades, total, ticketPromedio }`. Un día sin ventas devuelve ceros, nunca un error ni `NaN`.
- `src/reporte.js` imprime el reporte con resumen general, ventas por ciudad, unidades por producto, top 3 y resumen de dos días (`2026-09-05` con ventas y `2026-09-07` sin ventas). Los valores van en pesos con `toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })`.
- `src/depurar.js` reproduce los dos errores de la gerente con una versión "preliminar" y prueba que la v0.1 no los tiene.

### Registro de depuración

#### Error 1 · "Bogotá aparecía dos veces"

| Campo | Detalle |
|---|---|
| **Síntoma** | En el total por ciudad, la misma ciudad aparecía en dos filas (`Bogotá` y `Bogotá `). |
| **Entrada que lo produce** | Ventas cuya ciudad difiere en espacios finales o mayúsculas. En la muestra ya existe `medellín` (id 5) junto a `Medellín`; agregando una venta con `"Bogotá "` se reproduce exactamente el síntoma descrito. |
| **Hipótesis** | La agrupación usa el texto de la ciudad tal cual como clave del objeto. Para JavaScript, `"Bogotá"` y `"Bogotá "` son claves distintas. |
| **Prueba realizada** | Imprimir `Object.keys(grupos)` de la versión preliminar con la entrada anterior: `['Medellín','Bogotá','Cali','medellín','Pereira','Bogotá ']`, 6 claves en lugar de 4. Luego comparar con `totalPorCiudad` de la v0.1 con la misma entrada. |
| **Causa** | Clave de agrupación sin normalizar (`grupos[venta.ciudad]`). |
| **Corrección** | `totalPorCiudad` usa `nombreCanonico(venta.ciudad)` (`trim()`, `toLowerCase()` y primera letra en mayúscula) como clave. Con la misma entrada devuelve exactamente 4 claves: `['Medellín','Bogotá','Cali','Pereira']`. Verificado en `depurar.js` y `verificar.js`. |

#### Error 2 · "El ticket promedio daba NaN cuando filtraba un día sin ventas"

| Campo | Detalle |
|---|---|
| **Síntoma** | El ticket promedio mostraba `NaN` al filtrar un día sin ventas. |
| **Entrada que lo produce** | Un arreglo vacío, por ejemplo `ventas.filter(v => v.fecha === "2026-09-07")`, que da `[]`. |
| **Hipótesis** | Se divide el total entre la cantidad de ventas; con arreglo vacío es `0 / 0`, que en JavaScript es `NaN`. |
| **Prueba realizada** | En la consola: `0 / 0` da `NaN` y `ticketPromedioIngenuo([])` da `NaN`. Se confirma que el denominador (`lista.length`) es 0. |
| **Causa** | Falta de guarda para el caso "sin ventas válidas": no se comprobó el denominador antes de dividir. |
| **Corrección** | `ticketPromedio` cuenta solo ventas válidas (`cantidad > 0`) y, si `validas === 0`, devuelve `0` antes de dividir. `ventasDelDia` la reutiliza. Prueba: `ticketPromedio([]) === 0`, `ventasDelDia(ventas, "2026-09-07").ticketPromedio === 0`, y un día con solo ventas de cantidad 0 también da 0. |

La versión del MiniReto 2 ya incluía la guarda desde su diseño (decisión documentada para `[]`). Por eso, para reproducir los errores fue necesario escribir la versión ingenua en `depurar.js`; el reto pide demostrar que la v0.1 no los presenta, y las pruebas lo hacen.

### Verificación final del reporte

`node src/reporte.js | grep -E "NaN|undefined"` no encuentra coincidencias. Las cuatro secciones se imprimen y el día sin ventas muestra el mensaje "sin ventas registradas este día" con valores en cero. Las ciudades aparecen exactamente una vez cada una.

