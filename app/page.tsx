import Image from "next/image";
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
            복잡한 문제를 간결한 코드로 해결하는 것을 좋아합니다.
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
                <li>화려함보다 간결함을 추구합니다.</li>
              </ol>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">약속 </h3>
              <ol className="text-gray-600 space-y-2">
                <li>규칙을 지키는 것은 협업의 기본입니다.</li>
                <li>주어진 일은 반드시 해냅니다.</li>
              </ol>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">뭔가 하나 더</h3>
              <ol className="text-gray-600 space-y-2">
                <li>블라블라.</li>
                <li>라블라블.</li>
              </ol>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">뭔가 두개 더</h3>
              <ol className="text-gray-600 space-y-2">
                <li>블라블라.</li>
                <li>라블라블.</li>
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

      {/* Skills Section */}
      <section id="skills" className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">기술 스택</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Language</h3>
              <div className="flex flex-wrap gap-2">
                <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" className="h-7" />
                <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=black" alt="JavaScript" className="h-7" />
                <img src="https://img.shields.io/badge/C++-00599C?style=for-the-badge&logo=c%2B%2B&logoColor=white" alt="C++" className="h-7" />
                <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java" className="h-7" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Framework & Library</h3>
              <div className="flex flex-wrap gap-2">
                <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" className="h-7" />
                <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" className="h-7" />
                <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" className="h-7" />
                <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot" className="h-7" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Tools & Others</h3>
              <div className="flex flex-wrap gap-2">
                <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git" className="h-7" />
                <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" className="h-7" />
                <img src="https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white" alt="Kubernetes" className="h-7" />
                <img src="https://img.shields.io/badge/CMake-064F8C?style=for-the-badge&logo=cmake&logoColor=white" alt="CMake" className="h-7" />
                <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" className="h-7" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">프로젝트</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Portfolio Website */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <Link
                href="https://github.com/jiminu/first_deploy"
                target="_blank"
                className="block"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Portfolio Website</h3>
                <p className="text-gray-600 mb-4">Next.js와 Tailwind CSS로 제작한 개인 포트폴리오 웹사이트</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-black text-white px-2 py-1 rounded">Next.js</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">TypeScript</span>
                  <span className="text-xs bg-cyan-100 text-cyan-800 px-2 py-1 rounded">Tailwind CSS</span>
                </div>
              </Link>
            </div>

            {/* AstroLibrary */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AstroLibrary</h3>
              <p className="text-gray-600 mb-4">인공위성의 실시간 시공간 분석을 위한 RESTful API 개발</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Python</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">REST API</span>
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Space Tech</span>
                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Research</span>
              </div>
            </div>

            {/* TSP Solver */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">TSP Solver</h3>
              <p className="text-gray-600 mb-4">Voronoi 기반 외판원 문제 해법 연구 및 성능 분석</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Algorithm</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Python</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Optimization</span>
                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Research</span>
              </div>
            </div>

            {/* Space Object Tracking */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Space Object Tracking</h3>
              <p className="text-gray-600 mb-4">Three-filter Algorithm을 활용한 우주물체 시공간 추론 성능 분석</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Space Tech</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Algorithm</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Data Analysis</span>
                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Research</span>
              </div>
            </div>

            {/* LG CNS Project (예상) */}
            {/* <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">MSA Team Project</h3>
              <p className="text-gray-600 mb-4">LG CNS 캠프에서 진행한 마이크로서비스 아키텍처 기반 팀 프로젝트</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Spring Boot</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">MSA</span>
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Docker</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Team Project</span>
              </div>
            </div> */}

          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">학력</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">한양대학교</h3>
                  <p className="text-gray-600 mt-1">융합기계공학과</p>
                  <p className="text-gray-500 text-sm mt-2">대학원 석사 졸업</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-sm">2022 - 2024</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-900 mb-2">주요 활동</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 한국CDE학회, 한국항공우주학회 논문 발표</li>
                  <li>• 우주물체 추적 및 최적화 알고리즘 연구</li>
                  <li>• 항공우주 관련 소프트웨어 개발</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">끝맺음</h2>
          <p className="text-gray-600 mb-8">좋은 인연으로 만나 뵐 수 있기를 바랍니다.</p>
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
