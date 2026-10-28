import { references } from '../data/research';

export function Excerpts({ items, label = 'Interview excerpts' }) {
  return (
    <section className="excerpts" aria-label={label}>
      {items.map((item, index) => (
        <figure className="excerpt" key={`${item.participant}-${index}`}>
          <blockquote>“{item.text}”</blockquote>
          <figcaption>
            {item.participant}
          </figcaption>
        </figure>
      ))}
    </section>
  );
}

export function LiteratureReferences({ ids }) {
  return (
    <ul className="literature-references" aria-label="Associated literature">
      {ids.map((id) => {
        const reference = references[id];
        return (
          <li key={id}>
            <strong>{reference.label}</strong>
            {reference.url ? (
              <a href={reference.url} target="_blank" rel="noreferrer">
                {reference.title}
              </a>
            ) : (
              <span>{reference.title}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function SourceNote({ children }) {
  return <p className="source-note">{children}</p>;
}
