/** global React */
const NarrativeBlock = ({ badge = 'Ügy 1', children }) => {
  return (
    <div className="narr" role="article" aria-label="Bevezető">
      <span className="badge">{badge}</span>
      {children}
    </div>
  );
};

window.NarrativeBlock = NarrativeBlock;


