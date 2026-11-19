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

<!-- fin -->
