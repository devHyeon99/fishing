// 버튼 컴포넌트

const Button = ({ text, onClick }) => {
  return (
    <button
      className="rounded-md border border-solid border-slate-400 px-3 py-2 hover:bg-slate-400 hover:text-white active:bg-slate-500 active:text-white"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
