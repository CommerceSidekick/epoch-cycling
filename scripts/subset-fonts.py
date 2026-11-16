# Rebuilds public/fonts/archivo-wdth.woff2 from @fontsource-variable/archivo:
# keeps only the axis ranges the site uses (wght 800-900, wdth 112-125) and the Latin glyphs we need.
# 90 KB -> about 30 KB. Run: pip install fonttools brotli && python3 scripts/subset-fonts.py
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset
src = "node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2"
f = instancer.instantiateVariableFont(TTFont(src), {"wght": (800, 900), "wdth": (112, 125)})
opts = subset.Options(); opts.flavor = "woff2"; opts.layout_features = ["kern", "liga", "calt"]; opts.name_IDs = ["*"]
s = subset.Subsetter(opts)
s.populate(unicodes=list(range(0x20, 0x7F)) + list(range(0xA0, 0x100)) + [0x2018, 0x2019, 0x201C, 0x201D, 0x2026, 0x2022, 0x00B7, 0x2192, 0x2197, 0x2191, 0x2193])
s.subset(f)
f.flavor = "woff2"
f.save("public/fonts/archivo-wdth.woff2")
print("wrote public/fonts/archivo-wdth.woff2")

# Mini font with the schwa used in the home page definition (/ˈepək/), loaded via unicode-range.
f = TTFont("node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-ext-500-normal.woff2")
o = subset.Options(); o.flavor = "woff2"
s2 = subset.Subsetter(o); s2.populate(unicodes=[0x259, 0x18F]); s2.subset(f)
f.flavor = "woff2"; f.save("public/fonts/jetbrains-mono-500-ipa.woff2")
print("wrote public/fonts/jetbrains-mono-500-ipa.woff2")
