export function BrandArt({ artwork, label, className = "" }: { artwork: string; label: string; className?: string }) {
  return <div className={`brand-art ${className}`} style={{ background: artwork }} role="img" aria-label={`${label} placeholder artwork`}>
    <span className="art-grain" aria-hidden="true" />
    <span className="art-mark" aria-hidden="true">CB<span>™</span></span>
    <span className="art-caption">CHEFBOYZ · INSTRUMENTAL STUDY</span>
  </div>;
}
