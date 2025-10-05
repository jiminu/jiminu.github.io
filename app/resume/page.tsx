import axios from 'axios';

const getResumeData = async () => {
    try {
        const response = await axios.get('https://raw.githubusercontent.com/jiminu/first_deploy/refs/heads/main/service/resume_general_info_service.json');
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export default async function ResumePage() {

    const response = await getResumeData();
    console.log('response: ', response);

    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <h1>자기소개</h1>
            <p>이름: {response.name}</p>
            <p>깃허브: <a href={response.github}>깃허브 주소</a></p>
        </div>
    );
}