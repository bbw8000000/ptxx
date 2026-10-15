"""Generate hero PNGs with emoji icons for blog cards."""
import os
from PIL import Image, ImageDraw, ImageFont

HERO_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'hero')

FONT_SERIF = 'C:/Windows/Fonts/NotoSerifSC-VF.ttf'
FONT_EMOJI = 'C:/Windows/Fonts/seguiemj.ttf'  # Windows emoji font

W, H = 900, 350

LIGHT_BG = (245, 240, 235)
LIGHT_TITLE = (44, 44, 44)
LIGHT_ACCENT = (194, 58, 43)
LIGHT_SUB = (138, 130, 117)

DARK_BG = (30, 30, 34)
DARK_TITLE = (232, 228, 220)
DARK_ACCENT = (232, 93, 74)
DARK_SUB = (158, 154, 144)

TOPICS = {
    'hello-world': ('你好，世界', '起笔，就是最好的开始', '🌍'),
    'growth-001': ('成长记录 #1', '每一步都算数', '🌱'),
    'growth-002': ('成长记录 #2', 'AI 不会替你成长', '🧠'),
    'growth-003': ('成长记录 #3', '关于「半途而废」', '🛤️'),
    'growth-004': ('成长记录 #4', '一个小失败', '💧'),
    'growth-005': ('成长记录 #5', '和别人的一段对话', '💬'),
    'growth-006': ('成长记录 #6', '坚持 vs 放弃', '⚖️'),
    'growth-007': ('成长记录 #7', '坚持 vs 放弃', '⚖️'),
    'growth-008': ('成长记录 #8', '坚持 vs 放弃', '⚖️'),
    'growth-009': ('成长记录 #9', '坚持 vs 放弃', '⚖️'),
    'ai-coding-tools': ('AI 辅助编程', '工具选择与技巧', '🤖'),
    'astro-blog-01': ('Astro 博客 #1', '为什么选 Astro', '🚀'),
    'astro-blog-02': ('Astro 博客 #2', '项目结构与配置', '📁'),
    'astro-blog-03': ('Astro 博客 #3', '样式与组件设计', '🎨'),
    'astro-5-features': ('Astro 5 → 6', '内容层与服务端岛屿', '⬆️'),
    'debugging-masterclass': ('调试的艺术', '从新手到高手', '🔍'),
    'dev-tools-2025': ('开发工具箱', '2025 年我的选择', '🧰'),
    'frontend-design-trends-2025': ('前端设计趋势', '2025 开发者方向', '📐'),
    'git-tips': ('Git 实用技巧', '日常开发救命操作', '🌿'),
    'markdown-guide': ('Markdown 指南', '写作的艺术', '✍️'),
    'rust-guide-2025': ('学 Rust', '2025 年的理由', '⚙️'),
    'vscode-productivity': ('VS Code 效率', '开发速度翻倍', '⌨️'),
    'web-performance': ('性能优化', 'Web 性能实践', '⚡'),
    'og-default': ('盘腿修仙', '一个走非主流路线的大专生', '🍁'),
}


def make_png(title: str, subtitle: str, emoji: str, mode: str) -> Image.Image:
    is_dark = mode == 'dark'
    bg = DARK_BG if is_dark else LIGHT_BG
    title_color = DARK_TITLE if is_dark else LIGHT_TITLE
    accent = DARK_ACCENT if is_dark else LIGHT_ACCENT
    sub_color = DARK_SUB if is_dark else LIGHT_SUB

    img = Image.new('RGB', (W, H), bg)
    draw = ImageDraw.Draw(img)

    # Emoji centered, large
    try:
        emoji_font = ImageFont.truetype(FONT_EMOJI, 80)
    except OSError:
        emoji_font = ImageFont.truetype(FONT_SERIF, 80)
    bbox = draw.textbbox((0, 0), emoji, font=emoji_font)
    ew = bbox[2] - bbox[0]
    draw.text(((W - ew) // 2, 50), emoji, font=emoji_font, fill=title_color + (255,) if isinstance(title_color, tuple) else title_color)

    # Title below emoji
    title_font = ImageFont.truetype(FONT_SERIF, 36)
    bbox = draw.textbbox((0, 0), title, font=title_font)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, 180), title, font=title_font, fill=title_color)

    # Accent line
    draw.rectangle([(W // 2 - 20), 230, (W // 2 + 20), 232], fill=accent)

    # Subtitle
    sub_font = ImageFont.truetype(FONT_SERIF, 15)
    bbox = draw.textbbox((0, 0), subtitle, font=sub_font)
    sw = bbox[2] - bbox[0]
    draw.text(((W - sw) // 2, 248), subtitle, font=sub_font, fill=sub_color)

    return img


def main() -> None:
    os.makedirs(HERO_DIR, exist_ok=True)
    for filename, (title, subtitle, emoji) in TOPICS.items():
        for mode in ('light', 'dark'):
            suffix = '_dark' if mode == 'dark' else ''
            img = make_png(title, subtitle, emoji, mode)
            path = os.path.join(HERO_DIR, f'{filename}{suffix}.png')
            img.save(path, 'PNG', optimize=True)
            print(f'  {filename}{suffix}.png')


if __name__ == '__main__':
    main()
