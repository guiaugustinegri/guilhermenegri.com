# 🎨 Paleta de Cores 

## 📋 Visão Geral
Paleta de cores sofisticada com tons de roxo/rosa para um visual premium e elegante, combinando profundidade com leveza e usando branco e tons escuros para contraste perfeito.

## 🌙 Cores Principais

### Backgrounds (Fundos)
- **Primary Background**: `#1C1C1C` - Fundo principal cinza muito escuro
- **Secondary Background**: `#2B2B2B` - Fundo secundário para seções
- **Card Background**: `#3A3A3A` - Fundo dos cards com profundidade

### Textos
- **Primary Text**: `#FFFFFF` - Texto principal branco puro
- **Secondary Text**: `#F5F5F5` - Texto secundário branco suave
- **Muted Text**: `#CCCCCC` - Texto muted para detalhes

### Cores de Destaque (Paleta Principal)
- **Primary Accent**: `#853464` - Roxo escuro (funciona como o tom mais sério e profundo, ótimo para títulos ou fundos de destaque)
- **Secondary Accent**: `#9C5171` - Roxo médio (pode ser usado em elementos de apoio, como boxes e bordas)
- **Tertiary Accent**: `#BE6577` - Rosado avermelhado (suave, pode entrar em detalhes ou backgrounds secundários)
- **Light Accent**: `#FFDE8F` - Amarelo pastel (traz luz e contraste, ótimo para destacar áreas claras e contrabalancear os tons mais pesados)
- **Vibrant Accent**: `#FA813C` - Laranja vibrante (perfeito para CTAs, botões, ícones ou elementos que precisam chamar atenção)

### Elementos Neutros
- **Branco**: `#FFFFFF` - Dá o respiro necessário no layout, principalmente em fundos
- **Preto/Cinza Escuro**: `#1C1C1C` ou `#2B2B2B` - Pode ser usado em tipografia ou para reforçar contraste

### Bordas e Divisores
- **Border Color**: `#555555` - Bordas principais
- **Border Light**: `#666666` - Bordas mais claras
- **Divider**: `#444444` - Linhas divisórias

### Sombras e Efeitos
- **Shadow Dark**: `rgba(0, 0, 0, 0.4)` - Sombras escuras
- **Shadow Light**: `rgba(0, 0, 0, 0.2)` - Sombras leves
- **Glow Primary**: `rgba(133, 52, 100, 0.3)` - Brilho roxo escuro
- **Glow Secondary**: `rgba(156, 81, 113, 0.2)` - Brilho roxo médio

## 📱 Aplicação por Componente

### Menu de Navegação
- Background: `rgba(28, 28, 28, 0.95)`
- Text: `#F5F5F5`
- Border: `rgba(255, 255, 255, 0.1)`
- Hover: `#853464`

### Seção Hero
- Background Video: Vídeo com overlay
- Overlay: `linear-gradient(135deg, rgba(28, 28, 28, 0.7) 0%, rgba(43, 43, 43, 0.6) 50%, rgba(133, 52, 100, 0.1) 100%)`
- Text: `#FFFFFF`
- Highlight: `rgba(133, 52, 100, 0.2)` background com `#FFFFFF` text

### Cards e Componentes
- Background: `#3A3A3A`
- Border: `#555555`
- Shadow: `0 15px 35px rgba(0, 0, 0, 0.4)`
- Hover Shadow: `0 25px 50px rgba(0, 0, 0, 0.5)`

### Botões
- Primary: `#853464` background, `#FFFFFF` text
- Secondary: `#9C5171` background, `#FFFFFF` text
- CTA: `#FA813C` background, `#FFFFFF` text
- Hover: Cores mais claras dos respectivos tons

## 🎯 Princípios de Uso

1. **Contraste**: Branco sobre tons escuros para máxima legibilidade
2. **Hierarquia**: Usar tons de roxo do escuro ao claro para profundidade
3. **Consistência**: Aplicar a mesma família de cores em componentes similares
4. **Acentos**: Usar laranja para CTAs e amarelo para destaques especiais
5. **Neutros**: Branco e cinzas escuros para equilíbrio e contraste

## 📊 Códigos Hexadecimais (Referência Rápida)

```css
/* Backgrounds */
--bg-primary: #1C1C1C;
--bg-secondary: #2B2B2B;
--bg-card: #3A3A3A;

/* Textos */
--text-primary: #FFFFFF;
--text-secondary: #F5F5F5;
--text-muted: #CCCCCC;

/* Acentos */
--accent-primary: #853464;    /* Roxo escuro */
--accent-secondary: #9C5171;  /* Roxo médio */
--accent-tertiary: #BE6577;   /* Rosado */
--accent-light: #FFDE8F;      /* Amarelo pastel */
--accent-vibrant: #FA813C;    /* Laranja vibrante */

/* Elementos Neutros */
--white: #FFFFFF;
--dark-gray: #1C1C1C;

/* Bordas */
--border-primary: #555555;
--border-light: #666666;
--divider: #444444;

/* Sombras */
--shadow-dark: rgba(0, 0, 0, 0.4);
--shadow-light: rgba(0, 0, 0, 0.2);
--glow-primary: rgba(133, 52, 100, 0.3);
--glow-secondary: rgba(156, 81, 113, 0.2);
```

## ✅ Checklist de Implementação

- [x] Atualizar variáveis CSS no :root
- [x] Aplicar cores em todas as seções
- [x] Verificar contraste de acessibilidade
- [x] Testar em diferentes dispositivos
- [x] Validar consistência visual
- [x] Atualizar gradientes para usar nova paleta
