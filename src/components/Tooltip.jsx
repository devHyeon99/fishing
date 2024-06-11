const Tooltip = ({ children, message, style, position }) => {
  const tooltipStyle = typeof style === 'object' ? style : {};
  const positionStyle = position
    ? { transform: `translate(${position.x}px, ${position.y}px)` }
    : {};

  return (
    <div className="group relative h-auto w-auto" style={{ ...tooltipStyle }}>
      {children}
      <span
        className="tooltip animate-tooltip absolute z-50 hidden w-auto whitespace-nowrap rounded-md bg-white px-1 py-0.5 text-xs text-blue-400 shadow-lg group-hover:block group-active:block"
        style={{ ...positionStyle }}
      >
        {message}
      </span>
    </div>
  );
};

export default Tooltip;
