export default function DownloadPreviewCard() {
  return (
    <div className="mt-20 mx-auto max-w-4xl animate-scale-in">
      <div className="gradient-border rounded-3xl p-2">
        <div className="rounded-[1.25rem] bg-surface/60 p-6 sm:p-8">
          <div className="grid gap-6 md:grid-cols-[1.4fr_1fr] items-center">
            <div className="aspect-video rounded-2xl overflow-hidden relative bg-black">
              <img
                src="https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=1280&q=70"
                alt="Preview"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-white">
                  Mastering Framer Motion · 18:42
                </span>
                <span className="rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white font-mono">
                  4K
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Ready to download
              </p>
              <h3 className="mt-1 text-lg font-semibold">
                Mastering Framer Motion in 2026
              </h3>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                  <span className="text-muted-foreground">Format</span>
                  <span className="font-mono">MP4</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                  <span className="text-muted-foreground">Quality</span>
                  <span className="font-mono">2160p · 4K</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                  <span className="text-muted-foreground">Size</span>
                  <span className="font-mono">412 MB</span>
                </div>
              </div>
              <button className="mt-4 w-full rounded-xl gradient-primary py-2.5 text-sm font-semibold text-white glow-primary">
                Download now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
