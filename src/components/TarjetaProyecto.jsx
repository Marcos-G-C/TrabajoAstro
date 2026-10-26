import "./TarjetaProyecto.css";

export default function TarjetaProyecto({
  titulo,
  descripcion,
  imagenes = [],
  enlace,
  textoEnlace = "Visitar página",
  tags = [],
  autor,
  fecha,
  children,
}) {
  return (
    <article className="tp-card">
      <header className="tp-header">
        <h1 className="tp-titulo">{titulo}</h1>

        {(autor || fecha) && (
          <p className="tp-meta">
            {autor && <span>Por {autor}</span>}
            {autor && fecha && <span> · </span>}
            {fecha && <time dateTime={fecha}>{fecha}</time>}
          </p>
        )}

        {tags.length > 0 && (
          <ul className="tp-tags">
            {tags.map((tag) => (
              <li key={tag} className="tp-tag">
                #{tag}
              </li>
            ))}
          </ul>
        )}
      </header>

      {descripcion && <p className="tp-descripcion">{descripcion}</p>}

      {imagenes.length > 0 && (
        <div className="tp-galeria">
          {imagenes.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`${titulo} - imagen ${i + 1}`}
              loading="lazy"
              className="tp-img"
            />
          ))}
        </div>
      )}

      {enlace && (
        <a
          href={enlace}
          target="_blank"
          rel="noopener noreferrer"
          className="tp-boton"
        >
          {textoEnlace} →
        </a>
      )}

      {/* Aquí puedes meter otros componentes, como <Valoracion /> */}
      {children && <div className="tp-extra">{children}</div>}
    </article>
  );
}