interface BrandLogoProps {
  compact?: boolean;
}

export function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <div className={compact ? "brand-logo is-compact" : "brand-logo"}>
      <strong>AB</strong>
      {!compact ? (
        <span>
          Amr Boghdady
          <small>Lifestyle Planner</small>
        </span>
      ) : null}
    </div>
  );
}
