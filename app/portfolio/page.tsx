import axios from 'axios';

const getPortfolioData = async () => {
    try {
        const response = await axios.get('https://raw.githubusercontent.com/jiminu/first_deploy/refs/heads/main/service/resume_portfolio_service.json');
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export default async function PortfolioPage() {
    
    const response = await getPortfolioData();
    console.log('response: ', response);    
    
    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20" >
            <h1>포트폴리오</h1>
            <p>첫번째 프로젝트: <a href={response.miniproject1}>프로젝트1 주소</a></p>
            <p>첫번째 프로젝트: <a href={response.miniproject2}>프로젝트2 주소</a></p>
        </div>
    );
}