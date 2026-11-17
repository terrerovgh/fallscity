# Falls City Dev Studio

## Objetivo
Construir y verificar una identidad original y una web estática bilingüe, móvil primero, para vender sitios web a tatuadores y estudios de tatuaje en Estados Unidos. No desplegar.

## Fuente comercial
- Dominio: https://fallscity.dev. Correo público: info@fallscity.dev.
- Louisville, Kentucky; trabajo remoto en EE. UU., EN/ES. Sin teléfono ni dirección postal pública.
- Artist: desde $650 + $49/mes. Studio: desde $1,400 + $99/mes o $990/año.
- 50% al inicio, 50% antes de publicar; dos rondas; impuesto de Kentucky cuando aplique.
- Dominio del cliente; al marcharse conserva dominio, contenido y copia del sitio. El panel alojado no se transfiere.
- Extras sin precio público. Enlazar una app existente no equivale a construir reservas.
- No inventar clientes, resultados, testimonios, premios, plazos, posiciones, biografías ni capacidades.

## Dirección e implementación
- Astro estático, TypeScript estricto, CSS propio, Worker pequeño. Sin React, CMS ni framework backend.
- Contenido y precios centralizados. EN en raíz; ES bajo /es/. Una sola geometría SVG para la marca.
- Prioridad: veracidad/seguridad, accesibilidad, diseño, rendimiento, efectos.
- Panel privado: solo diagrama conceptual etiquetado; nunca simular una captura real.
- Movimiento base visible sin JS; scroll timelines progresivas y reduced-motion completo.
- No enviar formularios, correos o mensajes; no acceder a zonas privadas; no desplegar ni comprar servicios.

## Archivos y propiedad
- El agente principal integra package.json, lockfile, tokens, layout, marca y contenido compartido.
- Un solo propietario por archivo. Subagentes reciben rutas y criterios explícitos.
- Evidencia interna en docs/ y artifacts/; nunca copiarla a public/.
- Actualizar docs/decisions.md y docs/progress.md al cerrar cada fase.
- Antes de entregar: npm test, pruebas Worker, capturas reales y revisión visual; documentar limitaciones.
