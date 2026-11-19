# Café Origen · Analítica v0.1

Motor de analítica de ventas para **Café Origen**, escrito en JavaScript (Node.js). Convierte el historial de ventas en un reporte de negocio legible por consola, sin necesidad de abrir el código.

## Requisitos

- [Node.js](https://nodejs.org) (versión LTS). No hay dependencias que instalar.

## Cómo ejecutarlo

```bash
node src/reporte.js
node src/explorar.js
node src/verificar.js
node src/pruebas.js
node src/depurar.js
```

- `reporte.js`: el reporte de negocio (lo que usa la gerente).
- `explorar.js`: explora la estructura de los datos.
- `verificar.js`: comprueba que ciclos y métodos dan lo mismo (todo debe salir OK).
- `pruebas.js`: indicadores con ciclos con arreglo completo, un elemento y vacío.
- `depurar.js`: reproduce y prueba la corrección de los dos errores reportados.

## Qué preguntas responde

1. ¿Cuánto se vendió en total y cuántas unidades salieron?
2. ¿Cuál fue la venta más grande?
3. ¿Cuánto gasta en promedio un cliente por compra (ticket promedio)?
4. ¿Cuánto se vendió en cada ciudad?
5. ¿Qué productos se vendieron más (por unidades)?
6. ¿Qué tres productos generaron más dinero?
7. ¿Cómo le fue a un día concreto, incluso si no hubo ventas?

## Estructura

```
cafe-origen-analitica/
├── bitacora.md
├── README.md
└── src/
    ├── datos.js
    ├── analitica.js
    ├── explorar.js
    ├── verificar.js
    ├── pruebas.js
    ├── depurar.js
    └── reporte.js
```

- `bitacora.md`: diccionario de datos, casos borde, pseudocódigo, trazas y depuración.
- `datos.js`: arreglo `ventas` (12 registros, tal como vienen).
- `analitica.js`: funciones de análisis (ciclos y métodos de arreglo).

## Decisiones sobre la calidad de los datos

Los datos originales no se modifican. Las ciudades se normalizan al comparar y agrupar (`medellín` = `Medellín`), las ventas con cantidad 0 no cuentan como ventas válidas para el ticket promedio, y los cálculos sobre conjuntos vacíos devuelven 0 (o `null` para `ventaMayor`), nunca `NaN`. Detalle en `bitacora.md`.
