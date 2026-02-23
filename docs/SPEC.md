# AI Image Gen — Playground AI Alternative

Free AI image generator with text-to-image capabilities, powered by state-of-the-art models.

## 竞品信息

| 项目 | 值 |
|------|-----|
| 对标竞品 | Playground AI |
| 竞品 URL | https://playgroundai.com |
| 预估月流量 | 2.5M |
| 定价模式 | Freemium (Free: 50 images/day, Pro: $15/mo) |

## 核心功能（必做）

1. **Text-to-Image** — 输入文字描述，生成高质量图片
2. **多模型支持** — DALL-E 3, Stable Diffusion XL 等
3. **风格预设** — 动漫、写实、油画、水彩等预设风格
4. **图片下载** — 高清无水印下载

## 差异化定位

- ✅ 免费使用（每日 5 次免费生成）
- ✅ 无需注册即可试用
- ✅ 多模型选择（不只是单一模型）
- ✅ 快速生成，无需排队
- ✅ 无水印下载

## 截流关键词（🔴 SEO 必用）

### Primary（首页 Title/H1）
- `playground ai alternative`
- `playground ai free alternative`

### Secondary（独立页面）
- `playground ai vs midjourney`
- `best playground ai alternatives 2026`

### Long-tail（Programmatic SEO）
- `playground ai alternative free no signup`
- `playground ai alternative for anime`
- `playground ai alternative for realistic photos`

## 技术方案

- **前端**：React + Vite (TypeScript) + TailwindCSS
- **后端**：Python FastAPI
- **AI 调用**：通过 llm-proxy.densematrix.ai（调用 DALL-E 3 API）
- **数据库**：SQLite（token 管理）
- **部署**：Docker → langsheng (39.109.116.180)
- **端口**：Frontend 30122, Backend 30123
- **域名**：ai-image-gen.demo.densematrix.ai

## 美学方向

**Aesthetic**: Creative Studio / Digital Canvas
- 深色主题为主，突出生成的图片
- 渐变光晕效果作为背景装饰
- 动态加载动画展示 AI 生成过程
- 字体：Display 用 Sora，Body 用 DM Sans
- 配色：深紫蓝底色 + 荧光青/粉点缀

## 完成标准

- [x] Text-to-Image 核心功能可用
- [ ] 部署到 ai-image-gen.demo.densematrix.ai
- [ ] SEO 截流关键词已覆盖（Title、H1、comparison section）
- [ ] Health check 通过
- [ ] 支付集成完成（Creem）
- [ ] i18n 7种语言
- [ ] 测试覆盖率 95%+
