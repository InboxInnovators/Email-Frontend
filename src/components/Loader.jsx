import React from 'react';

const Loader = () => {
  return (
    <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid grid-cols-3 gap-[6px] w-[72px] h-[72px]">
      {[...Array(9)].map((_, index) => (
        <div
          key={index}
          style={{
            animation: `moveBox-${index + 1} 4s infinite`
          }}
          className="w-[20px] h-[20px] relative"
        >
          <div className={`
            absolute left-0 top-0 w-full h-full bg-blue-500
            ${[0, 3].includes(index) ? 'translate-x-[26px]' : ''}
            ${index === 2 ? 'translate-y-[52px]' : ''}
          `} />
        </div>
      ))}
      <style jsx>{`
        @keyframes moveBox-1 {
          9.0909090909% { transform: translate(-26px, 0); }
          18.1818181818% { transform: translate(0px, 0); }
          27.2727272727% { transform: translate(0px, 0); }
          36.3636363636% { transform: translate(26px, 0); }
          45.4545454545% { transform: translate(26px, 26px); }
          54.5454545455% { transform: translate(26px, 26px); }
          63.6363636364% { transform: translate(26px, 26px); }
          72.7272727273% { transform: translate(26px, 0px); }
          81.8181818182% { transform: translate(0px, 0px); }
          90.9090909091% { transform: translate(-26px, 0px); }
          100% { transform: translate(0px, 0px); }
        }
        
        @keyframes moveBox-2 {
          9.0909090909% { transform: translate(0, 0); }
          18.1818181818% { transform: translate(26px, 0); }
          27.2727272727% { transform: translate(0px, 0); }
          36.3636363636% { transform: translate(26px, 0); }
          45.4545454545% { transform: translate(26px, 26px); }
          54.5454545455% { transform: translate(26px, 26px); }
          63.6363636364% { transform: translate(26px, 26px); }
          72.7272727273% { transform: translate(26px, 26px); }
          81.8181818182% { transform: translate(0px, 26px); }
          90.9090909091% { transform: translate(0px, 26px); }
          100% { transform: translate(0px, 0px); }
        }

        @keyframes moveBox-3 {
          9.0909090909% { transform: translate(-26px, 0); }
          18.1818181818% { transform: translate(-26px, 0); }
          27.2727272727% { transform: translate(0px, 0); }
          36.3636363636% { transform: translate(-26px, 0); }
          45.4545454545% { transform: translate(-26px, 0); }
          54.5454545455% { transform: translate(-26px, 0); }
          63.6363636364% { transform: translate(-26px, 0); }
          72.7272727273% { transform: translate(-26px, 0); }
          81.8181818182% { transform: translate(-26px, -26px); }
          90.9090909091% { transform: translate(0px, -26px); }
          100% { transform: translate(0px, 0px); }
        }

        @keyframes moveBox-4 {
          9.0909090909% { transform: translate(-26px, 0); }
          18.1818181818% { transform: translate(-26px, 0); }
          27.2727272727% { transform: translate(-26px, -26px); }
          36.3636363636% { transform: translate(0px, -26px); }
          45.4545454545% { transform: translate(0px, 0px); }
          54.5454545455% { transform: translate(0px, -26px); }
          63.6363636364% { transform: translate(0px, -26px); }
          72.7272727273% { transform: translate(0px, -26px); }
          81.8181818182% { transform: translate(-26px, -26px); }
          90.9090909091% { transform: translate(-26px, 0px); }
          100% { transform: translate(0px, 0px); }
        }

        @keyframes moveBox-5 {
          9.0909090909% { transform: translate(0, 0); }
          18.1818181818% { transform: translate(0, 0); }
          27.2727272727% { transform: translate(0, 0); }
          36.3636363636% { transform: translate(26px, 0); }
          45.4545454545% { transform: translate(26px, 0); }
          54.5454545455% { transform: translate(26px, 0); }
          63.6363636364% { transform: translate(26px, 0); }
          72.7272727273% { transform: translate(26px, 0); }
          81.8181818182% { transform: translate(26px, -26px); }
          90.9090909091% { transform: translate(0px, -26px); }
          100% { transform: translate(0px, 0px); }
        }

        @keyframes moveBox-6 {
          9.0909090909% { transform: translate(0, 0); }
          18.1818181818% { transform: translate(-26px, 0); }
          27.2727272727% { transform: translate(-26px, 0); }
          36.3636363636% { transform: translate(0px, 0); }
          45.4545454545% { transform: translate(0px, 0); }
          54.5454545455% { transform: translate(0px, 0); }
          63.6363636364% { transform: translate(0px, 0); }
          72.7272727273% { transform: translate(0px, 26px); }
          81.8181818182% { transform: translate(-26px, 26px); }
          90.9090909091% { transform: translate(-26px, 0px); }
          100% { transform: translate(0px, 0px); }
        }

        @keyframes moveBox-7 {
          9.0909090909% { transform: translate(26px, 0); }
          18.1818181818% { transform: translate(26px, 0); }
          27.2727272727% { transform: translate(26px, 0); }
          36.3636363636% { transform: translate(0px, 0); }
          45.4545454545% { transform: translate(0px, -26px); }
          54.5454545455% { transform: translate(26px, -26px); }
          63.6363636364% { transform: translate(0px, -26px); }
          72.7272727273% { transform: translate(0px, -26px); }
          81.8181818182% { transform: translate(0px, 0px); }
          90.9090909091% { transform: translate(26px, 0px); }
          100% { transform: translate(0px, 0px); }
        }

        @keyframes moveBox-8 {
          9.0909090909% { transform: translate(0, 0); }
          18.1818181818% { transform: translate(-26px, 0); }
          27.2727272727% { transform: translate(-26px, -26px); }
          36.3636363636% { transform: translate(0px, -26px); }
          45.4545454545% { transform: translate(0px, -26px); }
          54.5454545455% { transform: translate(0px, -26px); }
          63.6363636364% { transform: translate(0px, -26px); }
          72.7272727273% { transform: translate(0px, -26px); }
          81.8181818182% { transform: translate(26px, -26px); }
          90.9090909091% { transform: translate(26px, 0px); }
          100% { transform: translate(0px, 0px); }
        }

        @keyframes moveBox-9 {
          9.0909090909% { transform: translate(-26px, 0); }
          18.1818181818% { transform: translate(-26px, 0); }
          27.2727272727% { transform: translate(0px, 0); }
          36.3636363636% { transform: translate(-26px, 0); }
          45.4545454545% { transform: translate(0px, 0); }
          54.5454545455% { transform: translate(0px, 0); }
          63.6363636364% { transform: translate(-26px, 0); }
          72.7272727273% { transform: translate(-26px, 0); }
          81.8181818182% { transform: translate(-52px, 0); }
          90.9090909091% { transform: translate(-26px, 0); }
          100% { transform: translate(0px, 0); }
        }
      `}</style>
    </div>
  );
};

export default Loader;