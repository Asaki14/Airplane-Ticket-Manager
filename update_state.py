import re
import sys

with open('.planning/STATE.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Update Last activity
content = re.sub(
    r'^Last activity: .*$',
    r'Last activity: 2026-04-13 - Completed quick task 260414-0ol: 优化一下目前的UI表现，现在的UI我感觉有点太素了，整个页面看起来不是特别的专业，卡片的分布也有点过于紧，挺凑，然后不像是一个专业的平台的样子，可以做的更专业，可以参考一些更专业的平台比如携程或者是飞猪去哪儿这样的一些架构，然后进行一个调整，是可以使用UIUX Pro Max还有frontend design scale',
    content,
    flags=re.MULTILINE
)

# Add row to Quick Tasks Completed
# Find the table rows and append to the last one
table_pattern = r'(\|---\|---\|---\|---\|---\|\n(?:\|.*?\|\n)*)'
def append_row(match):
    table = match.group(1)
    new_row = '| 260414-0ol | 优化一下目前的UI表现，现在的UI我感觉有点太素了，整个页面看起来不是特别的专业，卡片的分布也有点过于紧，挺凑，然后不像是一个专业的平台的样子，可以做的更专业，可以参考一些更专业的平台比如携程或者是飞猪去哪儿这样的一些架构，然后进行一个调整，是可以使用UIUX Pro Max还有frontend design scale | 2026-04-13 | 92da94e | [260414-0ol-ui-ui-uiux-pro-max-frontend-design-scale](./quick/260414-0ol-ui-ui-uiux-pro-max-frontend-design-scale/) |\n'
    return table + new_row

content = re.sub(table_pattern, append_row, content)

with open('.planning/STATE.md', 'w', encoding='utf-8') as f:
    f.write(content)
