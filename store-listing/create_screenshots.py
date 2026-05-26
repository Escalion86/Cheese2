#!/usr/bin/env python3
"""
Generate placeholder screenshots for Google Play Store listing.
Cheese2 - Photo enhancement app with playing card overlays.
Resolution: 1080x1920 (9:16 portrait)
"""
from PIL import Image, ImageDraw, ImageFont
import os

random = __import__('random')
random.seed(42)

OUT = os.path.join(os.path.dirname(__file__), "screenshots")
W, H = 1080, 1920

DARK_BG = (18, 18, 18)
LIGHT_BG = (245, 245, 245)
ACCENT = (200, 50, 50)
GOLD = (212, 175, 55)
WHITE = (255, 255, 255)
GRAY = (160, 160, 160)
DARK_GRAY = (40, 40, 40)
CARD_BG = (30, 30, 30)

def font(size, bold=False):
    candidates = [
        f"/usr/share/fonts/truetype/dejavu/DejaVuSans{'-Bold' if bold else ''}.ttf",
        f"/usr/share/fonts/truetype/liberation/LiberationSans{'-Bold' if bold else '-Regular'}.ttf",
        f"/usr/share/fonts/truetype/freefont/FreeSans{('Bold' if bold else '')}.ttf",
    ]
    for c in candidates:
        if os.path.exists(c):
            return ImageFont.truetype(c, size)
    return ImageFont.load_default()

def rr(draw, xy, r, fill):
    x1,y1,x2,y2 = xy
    draw.rectangle([x1+r,y1,x2-r,y2], fill=fill)
    draw.rectangle([x1,y1+r,x2,y2-r], fill=fill)
    draw.ellipse([x1,y1,x1+2*r,y1+2*r], fill=fill)
    draw.ellipse([x2-2*r,y1,x2,y1+2*r], fill=fill)
    draw.ellipse([x1,y2-2*r,x1+2*r,y2], fill=fill)
    draw.ellipse([x2-2*r,y2-2*r,x2,y2], fill=fill)

def bar(draw, dark=True):
    draw.rectangle([0,0,W,60], fill=(0,0,0) if dark else (240,240,240))
    c = WHITE if dark else (0,0,0)
    f = font(32)
    draw.text((40,15), "9:41", fill=c, font=f)
    draw.rectangle([W-100,18,W-40,42], outline=c, width=2)
    draw.rectangle([W-40,24,W-34,36], fill=c)
    draw.rectangle([W-96,22,W-50,38], fill=c)

def nav(draw, active="photo"):
    draw.rectangle([0,H-140,W,H], fill=(25,25,25))
    items = [("Settings","settings"),("Photo","photo"),("About","about")]
    sp = W//3
    for i,(label, key) in enumerate(items):
        x = sp*i + sp//2
        on = (key == active)
        col = ACCENT if on else GRAY
        f1 = font(36)
        draw.text((x-50, H-128), label[:3], fill=col, font=f1)
        f2 = font(22)
        draw.text((x-40, H-80), label, fill=col, font=f2)

def save(img, name):
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, name)
    img.save(path, quality=95)
    sz = os.path.getsize(path) // 1024
    print(f"  {name}: {sz}KB")

# ── 1: Photo screen (heart card) ──
def ss1():
    img = Image.new('RGB',(W,H), DARK_BG)
    d = ImageDraw.Draw(img)
    bar(d)
    d.rectangle([0,60,W,160], fill=DARK_GRAY)
    d.text((40,75), "Cheese2", fill=WHITE, font=font(44,True))
    # gradient bg
    for y in range(160, H-200):
        p = (y-160)/(H-360)
        d.line([(80,y),(W-80,y)], fill=(int(60+p*40), int(80+p*30), int(100+p*20)))
    # person silhouette
    cx,cy = W//2, (160+H-200)//2
    d.ellipse([cx-80,cy-200,cx+80,cy-40], fill=(80,60,50))
    d.polygon([(cx-120,cy+100),(cx+120,cy+100),(cx+80,cy-40),(cx-80,cy-40)], fill=(50,50,70))
    # card overlay
    ov = Image.new('RGBA',(W,H),(0,0,0,0))
    o = ImageDraw.Draw(ov)
    cx2,cy2 = W//2, (160+H-200)//2
    rr(o, [cx2-150,cy2-100,cx2+150,cy2+320], 20, (255,255,255,200))
    o.text((cx2-130,cy2-90), "A", fill=(200,30,30,255), font=font(80,True))
    o.text((cx2-125,cy2-10), "♥", fill=(200,30,30,255), font=font(120))
    o.text((cx2-30,cy2+60), "♥", fill=(200,30,30,255), font=font(120))
    o.text((cx2+50,cy2+200), "A", fill=(200,30,30,255), font=font(80,True))
    o.text((cx2+55,cy2+130), "♥", fill=(200,30,30,255), font=font(120))
    img = Image.alpha_composite(img.convert('RGBA'),ov).convert('RGB')
    d = ImageDraw.Draw(img)
    yc = H-340
    d.rectangle([0,yc-20,W,H-140], fill=(20,20,20))
    d.ellipse([W//2-60,yc,W//2+60,yc+120], fill=ACCENT, outline=WHITE, width=4)
    d.ellipse([W//2-45,yc+15,W//2+45,yc+105], fill=WHITE)
    rr(d,[60,yc+20,200,yc+100], 15, DARK_GRAY)
    rr(d,[W-200,yc+20,W-60,yc+100], 15, DARK_GRAY)
    d.text((85,yc+40), "Gallery", fill=WHITE, font=font(28))
    d.text((W-185,yc+40), "Save", fill=WHITE, font=font(28))
    nav(d,'photo')
    save(img, "screenshot_1_photo_main.png")

# ── 2: Settings screen ──
def ss2():
    img = Image.new('RGB',(W,H), DARK_BG)
    d = ImageDraw.Draw(img)
    bar(d)
    d.rectangle([0,60,W,160], fill=DARK_GRAY)
    d.text((40,75), "Settings", fill=WHITE, font=font(44,True))
    y=180
    items=[("Dark Theme",True),("Start Photo on Load",False),("Language","Русский")]
    for label,val in items:
        rr(d,[40,y,W-40,y+90], 10, CARD_BG)
        d.text((60,y+25), label, fill=WHITE, font=font(36))
        if isinstance(val,bool):
            tx,ty=W-130,y+20
            if val:
                rr(d,[tx,ty,tx+80,ty+50], 25, (50,180,80))
                d.ellipse([tx+45,ty+5,tx+75,ty+45], fill=WHITE)
            else:
                rr(d,[tx,ty,tx+80,ty+50], 25, (80,80,80))
                d.ellipse([tx+5,ty+5,tx+35,ty+45], fill=GRAY)
        else:
            d.text((W-200,y+25), val, fill=GRAY, font=font(32))
        y+=110
    # sliders
    for lbl,pct in [("Card Angle",85),("Card Scale",80)]:
        rr(d,[40,y,W-40,y+90], 10, CARD_BG)
        d.text((60,y+15), f"{lbl}: {pct}{'°' if 'Angle' else '%'}", fill=WHITE, font=font(34))
        rr(d,[60,y+60,W-60,y+78], 5, GRAY)
        rr(d,[60,y+60,60+int(pct/100*(W-120)),y+78], 5, ACCENT)
        sx=60+int(pct/100*(W-120))
        d.ellipse([sx-15,y+53,sx+15,y+83], fill=WHITE)
        y+=110
    d.text((40,H-180), "Version 1.1.0", fill=GRAY, font=font(28))
    nav(d,'settings')
    save(img, "screenshot_2_settings.png")

# ── 3: About screen ──
def ss3():
    img = Image.new('RGB',(W,H), DARK_BG)
    d = ImageDraw.Draw(img)
    bar(d)
    d.rectangle([0,60,W,160], fill=DARK_GRAY)
    d.text((40,75), "About", fill=WHITE, font=font(44,True))
    # icon
    ix,iy = W//2-100,200
    rr(d,[ix,iy,ix+200,iy+200], 40, (40,40,40))
    d.text((ix+55,iy+45), "♥", fill=ACCENT, font=font(100))
    d.text((ix+15,iy+5), "A", fill=WHITE, font=font(48,True))
    # name
    d.text((W//2-110,iy+240), "Cheese2", fill=WHITE, font=font(52,True))
    dy=iy+310
    for line in ["Photo enhancement with playing","card overlays. Capture photos,","apply card effects, and save","to your gallery."]:
        d.text((140,dy), line, fill=GRAY, font=font(30))
        dy+=42
    dy+=30
    for lbl,val in [("Developer","Escalion"),("Version","1.1.0"),("Package","cheese2.escalion.ru")]:
        rr(d,[60,dy,W-60,dy+70], 10, CARD_BG)
        d.text((80,dy+18), lbl, fill=GRAY, font=font(28))
        d.text((W-80-len(val)*17,dy+15), val, fill=WHITE, font=font(30,True))
        dy+=85
    d.text((W//2-110,H-200), "© 2026 Escalion", fill=(80,80,80), font=font(24))
    nav(d,'about')
    save(img, "screenshot_3_about.png")

# ── 4: Photo with spade card ──
def ss4():
    img = Image.new('RGB',(W,H), DARK_BG)
    d = ImageDraw.Draw(img)
    bar(d)
    d.rectangle([0,60,W,160], fill=DARK_GRAY)
    d.text((40,75), "Cheese2", fill=WHITE, font=font(44,True))
    for y in range(160,H-200):
        p=(y-160)/(H-360)
        d.line([(80,y),(W-80,y)], fill=(int(100+p*30),int(140+p*20),int(180-p*40)))
    # mountains
    d.polygon([(80,H-300),(300,400),(500,H-300)], fill=(60,80,60))
    d.polygon([(400,H-300),(700,350),(W-80,H-300)], fill=(50,70,50))
    d.rectangle([80,H-300,W-80,H-200], fill=(40,60,40))
    # spade card
    ov=Image.new('RGBA',(W,H),(0,0,0,0))
    o=ImageDraw.Draw(ov)
    cx2,cy2=W//2,(160+H-200)//2
    rr(o,[cx2-130,cy2-120,cx2+130,cy2+260], 20, (240,240,240,210))
    o.text((cx2-115,cy2-105), "K", fill=(20,20,20,255), font=font(75,True))
    o.text((cx2-110,cy2-30), "♠", fill=(20,20,20,255), font=font(110))
    o.text((cx2-35,cy2+40), "♠", fill=(20,20,20,255), font=font(110))
    o.text((cx2+40,cy2+170), "K", fill=(20,20,20,255), font=font(75,True))
    o.text((cx2+45,cy2+100), "♠", fill=(20,20,20,255), font=font(110))
    img=Image.alpha_composite(img.convert('RGBA'),ov).convert('RGB')
    d=ImageDraw.Draw(img)
    yc=H-340
    d.rectangle([0,yc-20,W,H-140], fill=(20,20,20))
    d.ellipse([W//2-60,yc,W//2+60,yc+120], fill=ACCENT, outline=WHITE, width=4)
    d.ellipse([W//2-45,yc+15,W//2+45,yc+105], fill=WHITE)
    rr(d,[60,yc+20,200,yc+100], 15, DARK_GRAY)
    rr(d,[W-200,yc+20,W-60,yc+100], 15, DARK_GRAY)
    d.text((85,yc+40), "Gallery", fill=WHITE, font=font(28))
    d.text((W-185,yc+40), "Save", fill=WHITE, font=font(28))
    nav(d,'photo')
    save(img, "screenshot_4_photo_spade.png")

# ── 5: Feature/Banner style ──
def ss5():
    img = Image.new('RGB',(W,H), (15,15,25))
    d = ImageDraw.Draw(img)
    for y in range(H):
        p=y/H
        d.line([(0,y),(W,y)], fill=(int(15+p*20),int(15+p*10),int(25+p*30)))
    for pos,suit in [((100,200),'♥'),((600,500),'♠'),((200,900),'♦'),((700,1100),'♣')]:
        d.text(pos, suit, fill=(40,30,50), font=font(200))
    # phone mockup
    px,py=W//2-200,250
    rr(d,[px,py,px+400,py+710], 30, (30,30,30))
    rr(d,[px+10,py+10,px+390,py+700], 25, DARK_BG)
    cx2,cy2=px+200,py+355
    rr(d,[cx2-60,cy2-90,cx2+60,cy2+90], 12, WHITE)
    d.text((cx2-50,cy2-80), "A", fill=ACCENT, font=font(32,True))
    d.text((cx2-30,cy2-40), "♥", fill=ACCENT, font=font(50))
    d.text((W//2-120,py+790), "Cheese2", fill=WHITE, font=font(56,True))
    d.text((W//2-170,py+860), "Photo + Card Magic", fill=GOLD, font=font(32))
    y=py+930
    for feat in ["Camera photo capture","Playing card overlays","Dark & Light themes","Save to gallery"]:
        d.text((W//2-150,y), f"✦ {feat}", fill=(180,180,200), font=font(26))
        y+=42
    save(img, "screenshot_5_feature.png")

if __name__=='__main__':
    os.makedirs(OUT, exist_ok=True)
    print("Generating screenshots...")
    ss1(); ss2(); ss3(); ss4(); ss5()
    print(f"\nDone. Files in {OUT}/:")
    for f in sorted(os.listdir(OUT)):
        if f.endswith('.png'):
            print(f"  {f}: {os.path.getsize(os.path.join(OUT,f))//1024}KB")
