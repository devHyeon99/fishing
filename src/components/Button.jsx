// 버튼 컴포넌트

const Button = ({ text, onClick }) => {
  return (
    <button
      className="rounded-md bg-blue-300 px-3 py-2 font-bold text-white shadow-md hover:bg-blue-400 active:bg-blue-500"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
