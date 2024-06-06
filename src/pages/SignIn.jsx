import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertModal } from '../components';
import { getUser, setUser } from '../utils';
import useModal from '../hooks/useModal';

function SignIn() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(true);
  const [inputId, setInputId] = useState('');
  const [inputPw, setInputPw] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [userData, setUserData] = useState([]);

  const alertModal = useModal();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      setUserData(user);
    };

    fetchUser();
  }, [activeTab]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!inputId || !inputPw) {
      setModalContent('아이디 혹은 비밀번호를 입력해주세요.');
      alertModal.openModal();
      return;
    }

    if (activeTab) {
      let adminUser = userData.find((user) => user.id === `${inputId}` && user.pw === `${inputPw}`);

      if (adminUser) {
        localStorage.setItem('userIdx', JSON.stringify(adminUser.idx));
        localStorage.setItem('userId', JSON.stringify(adminUser.id));
        navigate('/main');
      } else {
        setModalContent('회원정보가 일치하지 않습니다.');
        alertModal.openModal();
      }
    } else {
      const userInfo = {
        idx: 0,
        id: `${inputId}`,
        pw: `${inputPw}`,
        level: 1,
        exp: 0,
        coin: 0,
      };

      if (userData.find((user) => user.id === `${inputId}`)) {
        setModalContent('이미 존재하는 아이디입니다.');
        alertModal.openModal();
        return;
      }

      setUser(userInfo)
        .then((result) => {
          setModalContent('회원가입이 완료 되었습니다.');
          alertModal.openModal();
          setActiveTab(true);
          setInputId('');
          setInputPw('');
        })
        .catch((error) => {
          setModalContent('회원가입에 실패했습니다. 관리자에게 문의해주세요.');
          alertModal.openModal();
        });
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <header className="pb-10">
        <h1 className="flex items-center justify-center text-center text-3xl font-bold text-blue-300">
          fishing game
        </h1>
      </header>
      <section className="h-72">
        <form
          className="mx-8 flex h-full w-[300px] flex-col justify-center rounded-md border shadow-md"
          onSubmit={handleSubmit}
        >
          <legend className="flex-grow-0 py-2 text-center text-2xl font-semibold text-blue-400">
            {activeTab ? '로그인' : '회원가입'}
          </legend>
          <fieldset className="flex flex-grow flex-col justify-center gap-5 rounded-b-md bg-blue-100">
            {activeTab ? (
              <>
                <input
                  className="mx-auto block w-[150px] rounded-md border border-slate-300 p-1 text-sm shadow-md outline-none focus:border-blue-400"
                  type="text"
                  placeholder="아이디"
                  value={inputId}
                  onChange={(e) => setInputId(e.target.value)}
                />
                <input
                  className="mx-auto block w-[150px] rounded-md border border-slate-300 p-1 text-sm shadow-md outline-none focus:border-blue-400"
                  type="password"
                  placeholder="비밀번호"
                  value={inputPw}
                  onChange={(e) => setInputPw(e.target.value)}
                />
                <div className="flex flex-row flex-nowrap justify-center gap-5">
                  <button
                    className="rounded-md border border-slate-300 bg-white px-4 py-1 text-blue-500 shadow-md hover:bg-blue-300 hover:text-white"
                    type="submit"
                  >
                    로그인
                  </button>
                  <button
                    className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-blue-500 shadow-md hover:bg-blue-300 hover:text-white"
                    type="button"
                    onClick={() => {
                      setActiveTab(false);
                      setInputId('');
                      setInputPw('');
                    }}
                  >
                    회원가입
                  </button>
                </div>
              </>
            ) : (
              <>
                <input
                  className="mx-auto block w-[150px] rounded-md border border-slate-300 p-1 text-sm shadow-md outline-none focus:border-blue-400"
                  type="text"
                  placeholder="아이디"
                  value={inputId}
                  onChange={(e) => setInputId(e.target.value)}
                />
                <input
                  className="mx-auto block w-[150px] rounded-md border border-slate-300 p-1 text-sm shadow-md outline-none focus:border-blue-400"
                  type="password"
                  placeholder="비밀번호"
                  value={inputPw}
                  onChange={(e) => setInputPw(e.target.value)}
                />
                <div className="flex flex-row flex-nowrap justify-center gap-5">
                  <button
                    className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-blue-500 shadow-md hover:bg-blue-300 hover:text-white"
                    type="submit"
                  >
                    회원가입
                  </button>
                  <button
                    className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-blue-500 shadow-md hover:bg-blue-300 hover:text-white"
                    type="button"
                    onClick={() => {
                      setActiveTab(true);
                      setInputId('');
                      setInputPw('');
                    }}
                  >
                    돌아가기
                  </button>
                </div>
              </>
            )}
          </fieldset>
        </form>
      </section>
      <AlertModal isOpen={alertModal.isOpen} onClose={alertModal.closeModal}>
        <h2 className="rounded-t-md bg-blue-400 p-4 text-center font-semibold text-white">알림</h2>
        <span className="block py-4 text-center text-blue-500">{modalContent}</span>
      </AlertModal>
    </div>
  );
}

export default SignIn;
