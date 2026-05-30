# Le Maia Design System

Sistema de design mobile-first para o catálogo premium Le Maia.

## Tokens

| Arquivo | Conteúdo |
|---------|----------|
| `tokens/colors.ts` | Paleta brand + semânticas |
| `tokens/typography.ts` | Variantes tipográficas |
| `tokens/spacing.ts` | Espaçamento e layout |
| `tokens/shadows.ts` | Elevações |
| `tokens/radius.ts` | Border radius |
| `tokens/animations.ts` | Framer Motion presets |

## Componentes

```tsx
import {
  Button,
  Card,
  Input,
  Modal,
  BottomSheet,
  ToastContainer,
  toast,
  Loading,
  Skeleton,
  ProductCard,
  ScrollReveal,
  Typography,
} from "@/design-system";
```

### Botões

- `primary` — laranja (#FF6B00)
- `secondary` — nude
- `ghost` / `outline`
- Animação de press com Framer Motion

### ProductCard

Card de produto com imagem grande, favorito e botão comprar fixo.

### Toasts

```tsx
toast.success("Salvo!");
toast.error("Erro ao salvar");
```

## Uso em produção

O `AppProviders` já está no `app/layout.tsx` e inclui o `ToastContainer`.
