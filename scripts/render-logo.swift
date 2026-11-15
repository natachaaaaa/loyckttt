import AppKit
// Renders the logo SVGs to bitmaps (macOS, no dependency): hero roots WebP, share image, touch icon.
// See README > "Logo" for the exact commands.
// usage: og <letters.svg> <roots.svg> <out.png> <width> <height> <logoWidthRatio> [tagline]
let a = CommandLine.arguments
let W = CGFloat(Double(a[4])!), H = CGFloat(Double(a[5])!), ratio = CGFloat(Double(a[6])!)
let tagline = a.count > 7 ? a[7] : ""
guard let letters = NSImage(contentsOfFile: a[1]), let roots = NSImage(contentsOfFile: a[2]) else { print("svg load failed"); exit(1) }
let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: Int(W), pixelsHigh: Int(H), bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
NSGraphicsContext.saveGraphicsState()
NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
NSColor.black.setFill(); NSRect(x: 0, y: 0, width: W, height: H).fill()
let lw = W * ratio, lh = lw * letters.size.height / letters.size.width
let rect = NSRect(x: (W - lw) / 2, y: (H - lh) / 2 + (tagline.isEmpty ? 0 : H * 0.06), width: lw, height: lh)
roots.draw(in: rect); letters.draw(in: rect)
if !tagline.isEmpty {
  let font = NSFont(name: "Didot", size: H * 0.06) ?? NSFont.systemFont(ofSize: H * 0.06)
  let style = NSMutableParagraphStyle(); style.alignment = .center
  let s = NSAttributedString(string: tagline, attributes: [.font: font, .foregroundColor: NSColor(calibratedWhite: 0.62, alpha: 1), .paragraphStyle: style, .kern: H * 0.012])
  s.draw(in: NSRect(x: 0, y: H * 0.1, width: W, height: H * 0.1))
}
NSGraphicsContext.restoreGraphicsState()
try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: a[3]))
print("ok \(letters.size) \(roots.size)")
