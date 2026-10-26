import React, { useState, useEffect, useMemo, useId } from "react";

/**
 * StarRating — solo estrellas, estilo Newgrounds.
 *
 * Props:
 *  - id:     identificador único (guarda tu voto en localStorage)
 *  - votes:  votos iniciales por estrella [1★, 2★, 3★, 4★, 5★]
 *  - size:   tamaño de cada estrella en px (por defecto 34)
 *
 * En .mdx:
 *   import StarRating from "./StarRating";
 *   <StarRating id="mi-post" votes={[0, 1, 3, 12, 40]} />
 */

const STAR =
  "M12 1.2l3.2 6.6 7.2 1.05-5.2 5.1 1.25 7.2L12 17.7l-6.45 3.45 1.25-7.2-5.2-5.1 7.2-1.05z";

const CSS = `
.ngr { display:inline-flex; gap:1px; cursor:pointer; user-select:none; vertical-align:middle; }
.ngr__star { position:relative; display:block; outline:none; }
.ngr__star > svg, .ngr__fill > svg { display:block; position:absolute; left:0; top:0; }
.ngr__fill { position:absolute; left:0; top:0; height:100%; overflow:hidden; pointer-events:none; }
.ngr__star:focus-visible { outline:2px solid #fda238; outline-offset:1px; border-radius:4px; }
.ngr__star:hover { transform:translateY(-1px); }
`;

function Star({ size, fill, hot, uid }) {
  const normal = `${uid}-n`;
  const bright = `${uid}-h`;
  const gid = hot ? bright : normal;
  const svgProps = { width: size, height: size, viewBox: "0 0 24 24", "aria-hidden": true };

  return (
    <span className="ngr__star" style={{ width: size, height: size }}>
      <svg {...svgProps}>
        <path d={STAR} fill="#454545" stroke="#000" strokeWidth="1.8" strokeLinejoin="round" />
        <path d={STAR} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth=".6" strokeLinejoin="round" transform="translate(0 .35)" />
      </svg>

      <span className="ngr__fill" style={{ width: `${fill * 100}%` }}>
        <svg {...svgProps}>
          <defs>
            <linearGradient id={normal} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffe14d" />
              <stop offset=".55" stopColor="#ffc400" />
              <stop offset="1" stopColor="#f08a00" />
            </linearGradient>
            <linearGradient id={bright} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff07a" />
              <stop offset=".55" stopColor="#ffd21a" />
              <stop offset="1" stopColor="#ff9f0a" />
            </linearGradient>
          </defs>
          <path d={STAR} fill={`url(#${gid})`} stroke="#000" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M12 3.6l2.2 4.6 4.4.65" fill="none" stroke="rgba(255,255,255,.65)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </span>
  );
}

export default function StarRating({ id = "default", votes = [0, 0, 0, 0, 0], size = 34 }) {
  const uid = "ngr" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const storageKey = `ng-rating:${id}`;

  const [counts, setCounts] = useState(() => [0, 1, 2, 3, 4].map((i) => Number(votes[i]) || 0));
  const [myVote, setMyVote] = useState(0);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    try {
      const saved = parseInt(localStorage.getItem(storageKey), 10);
      if (saved >= 1 && saved <= 5) {
        setMyVote(saved);
        setCounts((c) => c.map((n, i) => (i === saved - 1 ? n + 1 : n)));
      }
    } catch (_) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const average = useMemo(() => {
    const t = counts.reduce((a, b) => a + b, 0);
    const s = counts.reduce((a, n, i) => a + n * (i + 1), 0);
    return t ? s / t : 0;
  }, [counts]);

  const vote = (v) => {
    setCounts((c) =>
      c.map((n, i) => {
        if (i === v - 1) return n + 1;
        if (myVote && i === myVote - 1) return Math.max(0, n - 1);
        return n;
      })
    );
    setMyVote(v);
    try {
      localStorage.setItem(storageKey, String(v));
    } catch (_) {}
  };

  // hover > tu voto > media de todos
  const shown = hover || myVote || average;

  return (
    <div className="ngr" role="radiogroup" aria-label="Valoración" onMouseLeave={() => setHover(0)}>
      <style>{CSS}</style>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          role="radio"
          aria-checked={myVote === n}
          aria-label={`${n} ${n === 1 ? "estrella" : "estrellas"}`}
          tabIndex={0}
          onMouseEnter={() => setHover(n)}
          onFocus={() => setHover(n)}
          onBlur={() => setHover(0)}
          onClick={() => vote(n)}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), vote(n))}
        >
          <Star size={size} fill={Math.max(0, Math.min(1, shown - (n - 1)))} hot={hover > 0} uid={uid} />
        </span>
      ))}
    </div>
  );
}