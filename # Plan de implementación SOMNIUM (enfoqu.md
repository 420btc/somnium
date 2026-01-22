# Plan de implementación SOMNIUM (enfoque sueños + IA local)

> Objetivo: construir SOMNIUM por fases, manteniendo foco en sueños, privacidad y rendimiento móvil.

---

## Fase 0 – Fundaciones del producto

-  **Definición de alcance inicial (MVP onírico):**  
   -  Elegir plataforma inicial (p.ej. móvil first: React Native / Flutter / nativo).  
   -  Definir módulos base: autenticación, perfil, settings de privacidad, almacenamiento local cifrado.  
   -  Diseñar modelo de datos inicial: usuario, noche, sueño, factores diarios.  

-  **Arquitectura y stack de IA local:**  
   -  Seleccionar motor de transcripción offline (modelo pequeño on-device).  
   -  Definir pipeline de análisis de sueños: extracción de temas, emociones, símbolos.  
   -  Establecer límites de CPU/batería y tamaño de modelos para móvil.  

-  **Sistema de diseño e interacción gestual:**  
   -  Definir navegación 100% gestual (swipes, doble tap, long press).  
   -  Componentes base reutilizables (pantallas, tarjetas, timelines, widgets).  
   -  Lineamientos de accesibilidad (VoiceOver/TalkBack, tamaños dinámicos, contraste).  

---

## Fase 1 – Núcleo onírico (Diario de sueños inteligente)

-  **Registro de sueños por voz y texto:**  
   -  Pantalla de registro rápido al despertar (un tap para grabar).  
   -  Transcripción automática offline + edición manual.  
   -  Guardado inmediato en almacenamiento local cifrado.  

-  **Estructura de diario de sueños:**  
   -  Lista cronológica de sueños (tarjetas con resumen, fecha, tags).  
   -  Vista detalle de sueño: texto, sentimiento dominante, símbolos detectados.  
   -  Búsqueda por palabras clave y filtros básicos (fecha, emoción, tema).  

-  **Trazado de línea temporal:**  
   -  Timeline visual de sueños destacados / marcados como importantes.  
   -  Posibilidad de marcar sueños como “memorable”, “pesadilla”, “lúcido”.  

---

## Fase 2 – Análisis IA de sueños y correlaciones

-  **Motor de análisis onírico:**  
   -  Clasificación de temas recurrentes (trabajo, familia, miedo, exploración…).  
   -  Detección de emociones predominantes por sueño y por semana.  
   -  Identificación de símbolos frecuentes (volar, caer, exámenes, agua…).  

-  **Correlación con vida diaria y sueño:**  
   -  Modelo que relacione sueños con: estrés diario, hábitos, calidad de sueño.  
   -  Panel de “Insights personales”:  
      -  “Tus pesadillas aumentan cuando…”  
      -  “Sueños lúcidos más frecuentes cuando…”  

-  **Sugerencias para recuerdo onírico (MILD/WILD):**  
   -  Recomendaciones personalizadas dentro del diario.  
   -  Micro-tips contextuales al registrar o revisar sueños.  

---

## Fase 3 – Journal diario y predicción de calidad de sueño

-  **Journal diario integrado (factores del día):**  
   -  Input rápido: humor, comida, ejercicio, cafeína, pantalla, estrés.  
   -  Formularios ultra ligeros (máx. 30–60 segundos).  

-  **Modelo predictivo local:**  
   -  Predicción de calidad de sueño de la próxima noche según hábitos y calendario.  
   -  Feedback visual sencillo: riesgo de mala noche / pesadillas / insomnio.  

-  **Rutinas de bedtime generadas por IA:**  
   -  Sugerencias diarias (“hoy tuviste X → haz Y antes de dormir”).  
   -  Integración con sonidos propios de la app (no copiar ruido blanco genérico).  

---

## Fase 4 – Coach de sueño conversacional

-  **Chat IA dentro de la app:**  
   -  Interfaz tipo chat accesible desde el diario y la home.  
   -  Contexto: sueños, factores diarios, calidad de sueño pasada.  

-  **Casos de uso clave:**  
   -  “¿Por qué tuve pesadillas esta semana?”  
   -  “¿Qué puedo hacer para recordar mejor mis sueños?”  
   -  “¿Cómo mejorar mi higiene del sueño?”  

-  **Seguridad y disclaimers:**  
   -  Mensajes claros: no es médico, no sustituye terapia.  
   -  Detección básica de contenido sensible para sugerir apoyo profesional.  

---

## Fase 5 – Sueño lúcido y motivación profunda

-  **Sistema de inducción de sueños lúcidos:**  
   -  Recordatorios diurnos de reality checks personalizados.  
   -  Audios binaurales / guías pre-sueño (descargados para uso offline).  
   -  Planes paso a paso (MILD, WILD, etc.) adaptados al usuario.  

-  **Gamificación “Sueño Épico”:**  
   -  Rachas de registro de sueños / diario / reality checks.  
   -  Badges temáticos: “Explorador Onírico”, “Maestro Lúcido”, etc.  
   -  Niveles que desbloquean audios, visuales y filtros artísticos exclusivos.  

-  **Desafíos semanales personalizados:**  
   -  Objetivos sencillos (“3 sueños registrados”, “2 reality checks diarios”).  
   -  Recompensas visuales (animaciones relajantes, nuevas visuales oníricas).  

---

## Fase 6 – Comunidad anónima y exploración creativa

-  **Comunidad 100% anónima:**  
   -  Publicar versiones anonimizadas de sueños (sin datos personales).  
   -  Reacciones ligeras y comentarios guiados por IA (no interpretaciones absolutistas).  
   -  Tendencias globales de temas oníricos (siempre agregadas).  

-  **Moderación y seguridad:**  
   -  Filtros automáticos para contenido sensible/inapropiado.  
   -  Reportes y bloqueo de contenido o interacción si es necesario.  

-  **Exploración artística de sueños:**  
   -  Generación de visuales oníricos (local o con anonimización fuerte).  
   -  Galería onírica personal con timeline visual.  
   -  Modo Storytelling: transformar sueños en relatos breves.  

---

## Fase 7 – Modo Pro / Terapéutico

-  **Perfiles profesionales verificados:**  
   -  Registro y verificación básica de psicólogos/coaches de sueño.  
   -  Panel para recibir informes de pacientes (con consentimiento).  

-  **Herramientas para terapia:**  
   -  Marcar sueños “relevantes para sesión”.  
   -  Tags compartidos: trauma, ansiedad, duelo, etc.  
   -  Resúmenes periódicos de temas, pesadillas, impacto de intervenciones.  

-  **Control granular del paciente:**  
   -  Elegir qué se comparte, por cuánto tiempo.  
   -  Revocación de acceso inmediata, visible y sencilla.  

---

## Fase 8 – Privacidad radical, rendimiento y accesibilidad

-  **Privacidad y datos:**  
   -  Procesamiento local por defecto (transcripción + análisis + predicción).  
   -  Cifrado extremo a extremo para copias en la nube / comunidad / modo Pro.  
   -  Panel de transparencia explicando qué datos se usan y por qué.  
   -  Borrado seguro instantáneo (local + remoto).  

-  **Optimización móvil extrema:**  
   -  Medición de consumo real por noche (<5% objetivo).  
   -  Ajuste dinámico de frecuencia de análisis para ahorrar batería.  
   -  Carga diferida (lazy load) de módulos pesados y modelos IA.  

-  **Accesibilidad completa:**  
   -  VoiceOver/TalkBack en todas las pantallas críticas.  
   -  Tamaños de texto ajustables y alto contraste.  
   -  Gestos accesibles (evitar acciones clave basadas solo en precisión).  

---

## Fase 9 – Integraciones y exportación profesional

-  **Integraciones no invasivas:**  
   -  Lectura opcional de calendario / notas para detectar eventos estresantes.  
   -  Modo “Ambiente Inteligente” con sugerencias (sin requerir hardware externo).  

-  **Informes médicos profesionales:**  
   -  Generación de PDF con gráficos de sueños + sueño.  
   -  Enfoque clínico-ligero: útil para médico del sueño / psicólogo.  
   -  Exportación controlada y cifrada (correo seguro, descarga local, etc.).  

---

## Roadmap de entregas (macro)

-  **Versión 0.1 – MVP Onírico:**  
   -  Diario de sueños (voz + texto), timeline, búsqueda básica.  

-  **Versión 0.2 – IA Onírica Básica:**  
   -  Análisis de temas/emociones + insights personales iniciales.  

-  **Versión 0.3 – Journal + Predicción:**  
   -  Factores diarios + modelo predictivo simple + rutinas de bedtime.  

-  **Versión 0.4 – Sueño Lúcido + Gamificación:**  
   -  Reality checks, audios, rachas y badges.  

-  **Versión 0.5 – Coach Conversacional:**  
   -  Chat IA contextual sobre sueños y sueño.  

-  **Versión 0.6 – Creatividad + Comunidad:**  
   -  Visuales oníricos, galería, modo storytelling, comunidad anónima.  

-  **Versión 0.7 – Pro / Terapéutico + Informes:**  
   -  Modo profesional, informes y exportaciones clínicas.  

-  **Versión 1.0 – Pulido total:**  
   -  Optimización batería, accesibilidad, privacidad avanzada y estabilidad.  