/** global React */
const TaskCard = ({ title, children }) => {
  return (
    <section className="card" role="region" aria-label={title}>
      <h3>{title}</h3>
      {children}
    </section>
  );
};

window.TaskCard = TaskCard;


