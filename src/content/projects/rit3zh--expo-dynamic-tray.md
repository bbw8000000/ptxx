---
title: "rit3zh/expo-dynamic-tray"
owner: "rit3zh"
name: "expo-dynamic-tray"
fullName: "rit3zh/expo-dynamic-tray"
description: "📚 A morphing, keyboard-aware bottom-sheet tray."
sourceUrl: "https://github.com/rit3zh/expo-dynamic-tray"
stars: 171
forks: 12
language: "TypeScript"
topics: []
license: "未标注"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-07-02T06:29:17Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# expo-dynamic-tray

A morphing, keyboard-aware bottom-sheet **tray** for React Native.

## ✨ Features

- 🫧 **Morphing presentation** — a single spring drives translateY, backdrop opacity, and sheet scale together, so the tray _grows into place_ instead of just sliding
- 📐 **Auto-sizing** — the sheet springs to whatever its content measures; no fixed heights to maintain
- 🧭 **Multi-view navigation** with a real history stack — `setView("…")` pushes, `goBack()` unwinds however deep you went
- 🎞️ **Crossfade + scale morph** between views (incoming views scale/fade in, outgoing ones fade out) for a continuous, first-party feel
- ⌨️ **Keyboard-following** via `react-native-keyboard-controller` — the tray lifts itself above the keyboard and stays glued to it
- 👆 **Swipe / flick to dismiss** with both distance-threshold and velocity detection, plus a spring rubber-band return
- 🧩 **Persistent footer slot** — pass `footer` per view; it never unmounts while switching views, so buttons don't pop or collide
- 🪝 **Imperative or declarative** — open with `` or drive it from anywhere with `useTray().open()`
- 🧠 TypeScript-first, fully typed surface

---

## ⚙️ Installation

```bash
git clone https://github.com/rit3zh/expo-dynamic-tray
cd expo-dynamic-tray
bun start -c
```

Peer dependencies (already wired up in this template):

```bash
bun add react-native-reanimated react-native-gesture-handler react-native-safe-area-context react-native-keyboard-controller @expo/ui expo-symbols
```

---

## 🚀 Usage

Wrap your app once with `GestureHandlerRootView` and `KeyboardProvider`, then compose a `` anywhere in the tree.

```tsx
// app/_layout.tsx
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

export default function RootLayout() {
  return (
    
      
        
      
    
  );
}
```

The simplest possible tray — one trigger, one view:

```tsx
import { Tray } from "@/components/tray";
import { Text, View } from "react-native";

export function Example() {
  return (
    
      
        Show Tray
      

      
        
          
            Dynamic Tray
            Springs to its content's size and follows the keyboard.
          
        
      
    
  );
}
```

## Preview

https://github.com/user-attachments/assets/f4359500-fa88-464f-a4e9-894903401c1a


### Opening imperatively (`useTray`)

Any child of `` can drive it. Handy for native `@expo/ui` buttons, which must live inside a `` (so `` can't clone them directly):

```tsx
import { Tray, useTray } from "@/components/tray";
import { Button, Host } from "@expo/ui/swift-ui";
import { buttonStyle } from "@expo/ui/swift-ui/modifiers";

function ShowTrayButton() {
  const { open } = useTray();
  return (
    
       open()}
      />
    
  );
}

// A view can close itself the same way:
function Body() {
  const { close } = useTray();
  return  close()} />;
}
```

### Multi-view navigation

Register several ``s and move between them by id. The sheet morphs its height between them automatically; `goBack()` unwinds the history stack.

```tsx
import { Tray, useTray } from "@/components/tray";

function DefaultView() {
  const { setView } = useTray();
  return  setView("details")} />;
}

function DetailsView() {
  const { goBack } = useTray();
  return ;
}

export function Settings() {
  return (
    
      
        Settings ⚙
      
      
        
          
        
        
          
        
      
    
  );
}
```

### A persistent footer

Pass the _same_ `footer` element to the views that share it — it lives in a stable slot below the crossfading body, so it never unmounts or jumps while you navigate.

```tsx

  }>
    
  
  }>
    
  

```

---

## 🧱 Component Anatomy

```tsx

  
  
    
  

```

---

## 🧩 API

### `` (root)

| Prop             | Type        | Default     | Description                                      |
| ---------------- | ----------- | ----------- | ------------------------------------------------ |
| `defaultView`    | `string`    | `"default"` | Id of the view shown when the tray opens.        |
| `closeThreshold` | `number`    | `110`       | Drag distance (px) past which release dismisses. |
| `children`       | `ReactNode` | —           | `` and ``.           |

### ``

| Prop       | Type        | Description                                                           |
| ---------- | ----------- | --------------------------------------------------------------------- |
| `view`     | `string`    | Open directly to this view id (defaults to the root's `defaultView`). |
| `asChild`  | `boolean`   | Clone the single child and inject `onPress` instead of wrapping it.   |
| `style`    | `object`    | Style for the default `PressableScale` wrapper.                       |
| `children` | `ReactNode` | The pressable content.                                                |

### ``

| Prop       | Type        | Description                        |
| ---------- | ----------- | ---------------------------------- |
| `style`    | `object`    | Extra style merged onto the sheet. |
| `children` | `ReactNode` | One or more ``.         |

### ``

| Prop         | Type        | Description                                                      |
| ------------ | ----------- | ---------------------------------------------------------------- |
| `id`         | `string`    | Unique id used by `setView` / `goBack` and the trigger's `view`. |
| `footer`     | `ReactNode` | Content pinned in the stable footer slot for this view.          |
| `hideFooter` | `boolean`   | Hide the footer slot entirely while this view is active.         |
| `children`   | `ReactNode` | The view body.                                                   |

### `useTray()`

| Field                                         | Type                      | Description                                                          |
| --------------------------------------------- | ------------------------- | -------------------------------------------------------------------- |
| `open(view?)`                                 | `(view?: string) => void` | Open the tray (optionally to a specific view).                       |
| `close()`                                     | `() => void`              | Animate the tray closed.                                             |
| `visible`                                     | `boolean`                 | Whether the tray is mounted/visible.                                 |
| `view`                                        | `string`                  | The active view id.                                                  |
| `setView(id)`                                 | `(id: string) => void`    | Push a view onto the history stack.                                  |
| `goBack()`                                    | `() => void`              | Pop back to the previous view.                                       |
| `canGoBack`                                   | `boolean`                 | Whether there's history to unwind.                                   |
| `height` · `translateY` · `overlay` · `scale` | `SharedValue`     | Read-only animated drivers, for advanced UI that reacts to the tray. |

Also exported: `TrayHandle`, `TrayHeader`, `TrayCloseButton`, `TrayOptionsButton`, `TraySecondaryButton`.

---

## 🧱 Stack

[Expo SDK 56](https://expo.dev/changelog) · [React Native 0.85](https://reactnative.dev/) · [Reanimated 4](https://docs.swmansion.com/react-native-reanimated/) · [Gesture Handler 2](https://docs.swmansion.com/react-native-gesture-handler/) · [Keyboard Controller](https://kirillzyusko.github.io/react-native-keyboard-controller/) · [@expo/ui](https://docs.expo.dev/versions/latest/sdk/ui/) · Safe Area Context · [Expo Router](https://docs.expo.dev/router/introduction/)

---
