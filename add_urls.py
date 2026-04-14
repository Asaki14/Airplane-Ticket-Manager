import fitz

pdf_path = '/Users/wangyao/Desktop/简历/王尧-作品集.pdf'
out_path = '/Users/wangyao/Desktop/简历/王尧-作品集.pdf'

doc = fitz.open(pdf_path)

# Projects and their URLs
projects = [
    {"name": "论文排版 SaaS 网站", "url": "https://paiban.asaki.icu/"},
    {"name": "AI 智能排班系统", "url": "https://schedule.asaki.icu/"},
    {"name": "特价机票发现平台", "url": "https://hangyi.asaki.icu/"}
]

for page in doc:
    for proj in projects:
        text_instances = page.search_for(proj["name"])
        for inst in text_instances:
            # inst is a fitz.Rect(x0, y0, x1, y1)
            # We want to add text to the right of the title.
            # Let's say x = inst.x1 + 10, y = inst.y1
            # We also want to make it clickable.
            
            # Since titles are usually big, let's find the font size to match or make it a bit smaller.
            
            # Print to see coordinates
            print(f"Page {page.number}, found {proj['name']} at {inst}")
            
            # Insert text
            text_x = inst.x1 + 15
            text_y = inst.y1 - 3 # adjust baseline
            
            # Add text
            rc = page.insert_text(
                (text_x, text_y),
                proj["url"],
                fontsize=12,
                fontname="helv", # or another font
                color=(0.1, 0.5, 0.8) # a nice blue link color
            )
            
            # Add link
            # We need the bounding box of the inserted text to make it clickable
            # Approximate width of text: len(url) * 6
            w = len(proj["url"]) * 6.5
            link_rect = fitz.Rect(text_x, inst.y0, text_x + w, inst.y1)
            page.insert_link({"kind": fitz.LINK_URI, "uri": proj["url"], "from": link_rect})
            
doc.save('/Users/wangyao/Desktop/简历/王尧-作品集-含链接.pdf')
doc.close()
