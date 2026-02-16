# 🌟 Prompt Reutilizable: Diario de Gratitud Interactivo

> **Propósito:** Recrear exactamente el componente "Diario de Gratitud" de Aníma en cualquier proyecto React/Next.js. Copia este documento y pégalo como prompt a tu IA de desarrollo.

---

## 📋 PROMPT (Copiar desde aquí)

---

Necesito que crees un componente **"Diario de Gratitud"** interactivo con las siguientes especificaciones exactas. Debe ser una página completa dentro de una app React/Next.js.

### Stack Requerido

```
- React 18+ con "use client"
- Next.js (App Router)
- Framer Motion (animaciones)
- Lucide React (iconos)
- Tailwind CSS (estilos)
- Zustand (estado global con persistencia)
```

### Estructura del Componente

El componente es una **página completa** con 3 secciones verticales:

1. **Header** con botón de volver + título centrado
2. **Área de visualización** ("cielo de gratitud") — ocupa el espacio disponible
3. **Área de input** con botón CTA que revela un formulario

### Funcionalidad Exacta

#### 1. Store (Zustand con persistencia localStorage)

```typescript
w// Dentro de tu store de Zustand:
interface JournalEntry {
  id: string;        // Date.now().toString()
  text: string;      // Lo que escribió el usuario
  x: number;         // Posición X aleatoria (-40 a +40)
  y: number;         // Posición Y aleatoria (-30 a +30)
  date: string;      // new Date().toISOString()
}

// Acciones:
journalEntries: JournalEntry[]
addJournalEntry: (entry: JournalEntry) => void
```

Configurar persistencia con `zustand/middleware` → `persist` → `localStorage`.

#### 2. Header

```
[← botón volver]     "Diario de Gratitud"     [espaciador]
```

- Botón volver: `router.back()`, circular, fondo glassmorphism (`bg-white/8 backdrop-blur-xl border border-white/10`), icono `ArrowLeft` de Lucide
- Título: centrado, `font-serif font-bold text-lg text-white`
- Espaciador: `<div className="w-10" />` para balance visual

#### 3. Área de Visualización — "Cielo de Gratitud"

**Estructura visual:**

```
┌─────────────────────────────────┐
│  Contenedor con borde punteado  │
│  Fondo: gradiente sutil oscuro  │
│                                 │
│     ⭐ "café caliente"          │
│          ⭐ "mi familia"        │
│    ⭐ "un buen día"             │
│                                 │
│  (si vacío: texto placeholder)  │
└─────────────────────────────────┘
```

**CSS del contenedor:**

```css
flex-1 relative rounded-3xl 
bg-[COLOR_PRIMARIO]/10 
border-2 border-dashed border-white/20 
mb-6 overflow-hidden
```

**Gradiente de fondo interno:**

```css
absolute inset-0 
bg-gradient-to-b from-[COLOR_PRIMARIO]/5 to-[COLOR_SECUNDARIO]/5
```

**Estado vacío:**

```
absolute inset-0 flex items-center justify-center
texto: "Tu cielo de gratitud está vacío..."
color: text-[COLOR_MUTED]/60 text-sm italic
```

#### 4. Estrellas Flotantes (cada entrada de journal)

Esta es la parte más mágica. Cada texto que agrega el usuario se convierte en una **estrella flotante arrastreable** dentro del cielo.

**Animación con Framer Motion:**

```tsx
<AnimatePresence>
  {journalEntries.map((item) => (
    <motion.div
      key={item.id}
      // Animación de entrada: aparece desde abajo, rebotando
      initial={{ scale: 0, opacity: 0, y: 100 }}
      animate={{ 
        scale: 1, 
        opacity: 1, 
        y: item.y,    // Posición aleatoria guardada
        x: item.x,    // Posición aleatoria guardada
        rotate: [0, 10, -10, 0]  // Balanceo infinito
      }}
      transition={{ 
        type: "spring",
        bounce: 0.5,   // Rebote elástico
        rotate: { repeat: Infinity, duration: 5, ease: "easeInOut" }
      }}
      // Posicionamiento
      className="absolute inset-0 m-auto w-fit h-fit flex flex-col items-center gap-1 cursor-pointer"
      // ¡ARRASTREABLE!
      drag
      dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
    >
      {/* Icono de estrella con glow */}
      <div className="p-2 bg-[COLOR_ESTRELLA] rounded-full shadow-[0_0_20px_rgba(COLOR_GLOW,0.4)] animate-pulse">
        <Star size={20} className="text-[COLOR_ICONO] fill-[COLOR_FILL]" />
      </div>
    
      {/* Tooltip con el texto — aparece al hover */}
      <motion.span 
        initial={{ opacity: 0, scale: 0.8 }}
        whileHover={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-xl px-3 py-1 rounded-lg text-xs font-medium text-white/80 shadow-sm whitespace-nowrap opacity-0 transition-opacity border border-white/10"
      >
        {item.text}
      </motion.span>
    </motion.div>
  ))}
</AnimatePresence>
```

**Puntos clave de las estrellas:**

- Cada estrella se posiciona con `absolute inset-0 m-auto` (centrada) + offsets `x, y` aleatorios
- El `drag` de Framer Motion permite arrastrarlas con el dedo/mouse
- `dragConstraints` las mantiene dentro de un área razonable
- Tienen un `rotate` infinito que las hace balancearse sutilmente
- El tooltip del texto está oculto (`opacity-0`) y aparece en hover (`whileHover`)
- El glow (`shadow-[0_0_20px_...]`) + `animate-pulse` da el efecto de "brillo"

#### 5. Área de Input (Toggle CTA → Formulario)

**Estado 1: Botón CTA**

```tsx
<AnimatePresence mode="wait">
  {!showInput ? (
    <JewelButton variant="primary" className="w-full" onClick={() => setShowInput(true)}>
      <Plus className="mr-2" /> Agregar algo bueno
    </JewelButton>
  ) : (
    // Estado 2: Formulario expandido...
  )}
</AnimatePresence>
```

**Estado 2: Formulario expandido** (aparece con `motion.div` slide-up)

```tsx
<motion.div
  initial={{ y: 50, opacity: 0 }}       // Entra desde abajo
  animate={{ y: 0, opacity: 1 }}
  exit={{ y: 50, opacity: 0 }}          // Sale hacia abajo
>
  <GlassCard className="p-4 space-y-4">
    {/* Label */}
    <label className="text-sm font-medium text-white/80">
      ¿Por qué estás agradecido hoy?
    </label>
  
    {/* Textarea */}
    <textarea
      autoFocus
      value={inputText}
      onChange={(e) => setInputText(e.target.value)}
      className="w-full bg-white/8 rounded-xl p-3 text-white placeholder:text-white/30 
                 outline-none focus:ring-2 focus:ring-[COLOR_PRIMARIO]/50 
                 resize-none h-24 border border-white/10 backdrop-blur-xl"
      placeholder="Ej: Un café caliente, la sonrisa de un amigo..."
    />
  
    {/* Botones */}
    <div className="flex gap-2">
      <JewelButton variant="ghost" className="flex-1" onClick={() => setShowInput(false)}>
        Cancelar
      </JewelButton>
      <JewelButton variant="primary" className="flex-1" onClick={handleAddItem} disabled={!inputText.trim()}>
        ¡Iluminar! ✨
      </JewelButton>
    </div>
  </GlassCard>
</motion.div>
```

#### 6. Lógica de `handleAddItem`

```typescript
const handleAddItem = () => {
  if (!inputText.trim()) return;

  const newItem = {
    id: Date.now().toString(),
    text: inputText,
    x: Math.random() * 80 - 40,  // Rango: -40 a +40 píxeles
    y: Math.random() * 60 - 30,  // Rango: -30 a +30 píxeles
    date: new Date().toISOString(),
  };

  addJournalEntry(newItem);  // Guardar en Zustand (persiste en localStorage)
  setInputText("");           // Limpiar input
  setShowInput(false);        // Ocultar formulario
};
```

### Dependencias de Componentes

El Diario usa estos componentes auxiliares, que debes tener:

1. **MobileLayout** — Wrapper con fondo oscuro + aurora/gradientes + nav inferior
2. **GlassCard** — Tarjeta glassmorphism (`bg-white/8 backdrop-blur-xl border border-white/10 rounded-2xl`)
3. **JewelButton** — Botón con gradiente, efecto glossy, `whileTap` y `whileHover` de Framer

### Variables a Personalizar

Reemplaza estos valores según tu proyecto:

| Variable             | Ejemplo Aníma                         | Descripción                            |
| -------------------- | -------------------------------------- | --------------------------------------- |
| `COLOR_PRIMARIO`   | `#7ec8b8`                            | Color principal (teal, azul, etc.)      |
| `COLOR_SECUNDARIO` | `#a89cc8`                            | Color secundario (lavender, rosa, etc.) |
| `COLOR_MUTED`      | `#9490a7`                            | Texto secundario                        |
| `COLOR_ESTRELLA`   | `bg-amber-400/30`                    | Fondo del icono estrella                |
| `COLOR_GLOW`       | `rgba(251,191,36,0.4)`               | Color del glow/sombra                   |
| `COLOR_ICONO`      | `text-amber-300`                     | Color del icono Star                    |
| `COLOR_FILL`       | `fill-amber-100/50`                  | Relleno del icono                       |
| Título              | "Diario de Gratitud"                   | Título mostrado en el header           |
| Placeholder          | "Tu cielo de gratitud está vacío..." | Texto cuando no hay entradas            |
| CTA                  | "Agregar algo bueno"                   | Texto del botón principal              |
| Pregunta             | "¿Por qué estás agradecido hoy?"    | Label del textarea                      |

### Resultado Visual Esperado

```
┌──────────────────────────┐
│ ← Diario de Gratitud     │
│                          │
│ ┌- - - - - - - - - - -┐ │
│ │                      │ │
│ │   ⭐ (arrastreable)  │ │
│ │      ✨ "mi familia" │ │
│ │  ⭐                  │ │
│ │     ⭐               │ │
│ │                      │ │
│ └- - - - - - - - - - -┘ │
│                          │
│ [+ Agregar algo bueno  ] │
│                          │
│ ○ ○ ○ ○  (nav inferior) │
└──────────────────────────┘
```

### Efectos Clave que NO Debes Olvidar

1. **`drag` en las estrellas** — Esto es lo que hace que se puedan mover con el dedo
2. **`rotate: [0, 10, -10, 0]` infinito** — El balanceo sutil que da vida
3. **`bounce: 0.5`** — El rebote elástico al aparecer
4. **`animate-pulse` en el icono** — El brillo pulsante
5. **`shadow-[0_0_20px_...]`** — El halo de luz alrededor de cada estrella
6. **`whileHover` en el tooltip** — El texto se revela al tocar
7. **`AnimatePresence mode="wait"`** — Transición suave entre botón y formulario
8. **Posiciones aleatorias persistidas** — Las coordenadas `x, y` se guardan, así cada estrella siempre aparece donde fue creada
9. **`autoFocus` en textarea** — El campo se enfoca automáticamente al expandir

---

## FIN DEL PROMPT

---
