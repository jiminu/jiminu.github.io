import Image from "next/image";
import axios from 'axios';
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-8 py-16">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8">
            <Image
              src="/face.jpg"
              alt="Profile"
              width={120}
              height={120}
              className="rounded-full"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            안녕하세요, 지민우입니다
          </h1>
          {/* <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            열정적으로 코딩을 배우고 있는 개발자입니다. 
            새로운 기술을 익히고 문제를 해결하는 것을 좋아합니다.
          </p> */}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">성향</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">간결함</h3>
              <p className="text-gray-600 mb-4">
                읽기 쉬운 코드가 좋은 코드라고 생각합니다. 코드 뿐 아니라 다른 방면에서도 거창한 것보다 간결한 것을 추구합니다.
              </p>
            </div> */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">간결함 </h3>
              <ol className="text-gray-600 space-y-2">
                <li>읽기 쉬운 코드가 좋은 코드라고 생각합니다.</li>
                <li>코드 뿐 아니라 다른 방면에서도 거창한 것보다 간결한 것을 추구합니다.</li>
              </ol>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">약속 </h3>
              <ol className="text-gray-600 space-y-2">
                <li>규칙을 지키는 것은 협업의 기본입니다.</li>
                <li>주어진 일은 반드시 해냅니다.</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
      
      <section id="experience" className="py-16">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">경험</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* 컨퍼런스 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Image
                  src="/globe.svg"
                  alt="Conference"
                  width={24}
                  height={24}
                  className="mr-2"
                />
                컨퍼런스
              </h3>
              <ul className="space-y-4">
                <li className="border-l-2 border-blue-500 pl-4">
                  <div className="text-gray-900 font-medium">2022 한국CDE학회</div>
                  <div className="text-gray-600 text-sm">2022</div>
                  <div className="text-gray-700 mt-1">외판원 문제(TSP)를 위한 Voronoi기반 발견적 해법</div>
                </li>
                <li className="border-l-2 border-blue-500 pl-4">
                  <div className="text-gray-900 font-medium">2022 AMOS</div>
                  <div className="text-gray-600 text-sm">2022</div>
                  <div className="text-gray-700 mt-1">AMOS 부스 기업 참가</div>
                </li>
                <li className="border-l-2 border-blue-500 pl-4">
                  <div className="text-gray-900 font-medium">2023 한국항공우주학회</div>
                  <div className="text-gray-600 text-sm">2023</div>
                  <div className="text-gray-700 mt-1">AstroLibrary: 인공위성의 실시간 시공간 분석을 위한 RESTful API</div>
                </li>
                <li className="border-l-2 border-blue-500 pl-4">
                  <div className="text-gray-900 font-medium">2024 한국항공우주학회</div>
                  <div className="text-gray-600 text-sm">2024</div>
                  <div className="text-gray-700 mt-1">우주물체의 시공간 추론을 위한 Three-filter Algorithm의 수행 성능 분석</div>
                </li>
              </ul>
            </div>
            
            {/* 교육 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Image
                  src="/window.svg"
                  alt="Education"
                  width={24}
                  height={24}
                  className="mr-2"
                />
                교육
              </h3>
              <ul className="space-y-4">
                <li className="border-l-2 border-green-500 pl-4">
                  <div className="text-gray-900 font-medium">LG CNS AM INSPIRE CAMP 3기</div>
                  <div className="text-gray-600 text-sm">2025.07 ~ </div>
                  <div className="text-gray-700 mt-1">AM기반 MSA기술 및 팀프로젝트 </div>
                </li>
              </ul>
            </div>

            {/* 기타 활동 */}
            {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Image
                  src="/file.svg"
                  alt="Activities"
                  width={24}
                  height={24}
                  className="mr-2"
                />
                스터디/모임
              </h3>
              <ul className="space-y-4">
                <li className="border-l-2 border-purple-500 pl-4">
                  <div className="text-gray-900 font-medium">알고리즘 스터디</div>
                  <div className="text-gray-600 text-sm">2024.01 - 현재</div>
                  <div className="text-gray-700 mt-1">주 1회 알고리즘 문제 풀이 및 코드 리뷰</div>
                </li>
              </ul>
            </div> */}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">프로젝트</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 프로젝트 카드들은 나중에 추가 */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <Link
                href="https://github.com/jiminu/first_deploy"
                target="_blank"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">First Deploy</h3>
                <p className="text-gray-600 mb-4">Next.js로 만든 첫 번째 포트폴리오 웹사이트</p>
                <div className="flex gap-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Next.js</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">TypeScript</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">끝맺음</h2>
          <p className="text-gray-600 mb-8">좋은 인연으로 만나뵐 수 있기를 바랍니다.</p>
          <div className="flex justify-center gap-6">
            <Link 
              href="https://github.com/jiminu" 
              target="_blank"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              GitHub
            </Link>
            <Link 
              href="mailto:jmu417@gmail.com" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              jmu417@gmail.com
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
