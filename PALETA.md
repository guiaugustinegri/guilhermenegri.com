# 🎨 Paleta de Cores - Tema Escuro

## 📋 Visão Geral
Paleta de cores para o tema escuro do site, usando tons sofisticados que combinam elegância com boa legibilidade.

## 🌙 Cores Principais

### Backgrounds (Fundos)
- **Primary Background**: `#0a0a0a` - Fundo principal quase preto
- **Secondary Background**: `#1a1a1a` - Fundo secundário para seções
- **Card Background**: `#1f1f1f` - Fundo dos cards com leve brilho

### Textos
- **Primary Text**: `#ffffff` - Texto principal branco puro
- **Secondary Text**: `#e5e5e5` - Texto secundário cinza muito claro
- **Muted Text**: `#a8a8a8` - Texto muted para detalhes
- **Accent Text**: `#722f37` - Texto de destaque na cor vinho

### Bordas e Divisores
- **Border Color**: `#333333` - Bordas principais
- **Border Light**: `#404040` - Bordas mais claras
- **Divider**: `#2a2a2a` - Linhas divisórias

### Sombras e Efeitos
- **Shadow Dark**: `rgba(0, 0, 0, 0.3)` - Sombras escuras
- **Shadow Light**: `rgba(0, 0, 0, 0.1)` - Sombras leves
- **Glow Effect**: `rgba(114, 47, 55, 0.2)` - Efeito de brilho vinho

## 🎨 Cores de Destaque (Paleta Original)
- **Primary Accent**: `#722f37` - Vinho/Borgonha
- **Secondary Accent**: `#6b7f5a` - Verde Oliva
- **Hover State**: `#8b3f4a` - Vinho mais claro para hover

## 📱 Aplicação por Componente

### Menu de Navegação
- Background: `rgba(10, 10, 10, 0.95)`
- Text: `#e5e5e5`
- Border: `rgba(255, 255, 255, 0.1)`
- Hover: `#722f37`

### Seção Hero
- Background Video: Vídeo com overlay
- Overlay: `linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.7) 100%)`
- Text: `#ffffff`
- Highlight: `rgba(114, 47, 55, 0.2)` background com `#722f37` text

### Cards e Componentes
- Background: `#1f1f1f`
- Border: `#333333`
- Shadow: `0 10px 30px rgba(0, 0, 0, 0.3)`
- Hover Shadow: `0 20px 40px rgba(0, 0, 0, 0.4)`

### Botões
- Primary: `#722f37` background, `#ffffff` text
- Secondary: `transparent` background, `#e5e5e5` text, `#722f37` border
- Hover: `#8b3f4a` background (vinho mais claro)

## 🎯 Princípios de Uso

1. **Contraste**: Sempre manter contraste mínimo de 4.5:1 para acessibilidade
2. **Hierarquia**: Usar diferentes tons de cinza para criar hierarquia visual
3. **Consistência**: Aplicar as mesmas cores em componentes similares
4. **Acentos**: Usar vinho e oliva apenas para elementos de destaque
5. **Transições**: Manter suavidade nas transições entre estados

## 📊 Códigos Hexadecimais (Referência Rápida)

```css
/* Backgrounds */
--bg-primary: #0a0a0a;
--bg-secondary: #1a1a1a;
--bg-card: #1f1f1f;

/* Textos */
--text-primary: #ffffff;
--text-secondary: #e5e5e5;
--text-muted: #a8a8a8;

/* Acentos */
--accent-primary: #722f37;
--accent-secondary: #6b7f5a;
--accent-hover: #8b3f4a;

/* Bordas */
--border-primary: #333333;
--border-light: #404040;
--divider: #2a2a2a;
```

## ✅ Checklist de Implementação

- [ ] Atualizar variáveis CSS no :root
- [ ] Aplicar cores em todas as seções
- [ ] Verificar contraste de acessibilidade
- [ ] Testar em diferentes dispositivos
- [ ] Validar consistência visual
